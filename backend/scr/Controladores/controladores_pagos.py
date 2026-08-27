from fastapi import Depends, Query
from Utilidades.ids import siguiente_id
from Controladores.controladores_notificaciones import crear_notificacion
from sqlalchemy.orm import Session
from Conexion.database import get_db
import Modelos.models as models
from Excepciones.excepciones_pagos import ErrorPagoNoEncontrado, ErrorReservaNoPagable
from Excepciones.excepciones_reservas import ErrorReservaNoEncontrada
from Excepciones.excepciones_auth import ErrorNoAutorizado
from Utilidades.respuesta import respuesta_ok, respuesta_error
from Esquemas.Esquemas import PagoCrear
from Controladores.controladores_configuracion import obtener_configuracion
from Dependencias.dependencias import requiere_rol, obtener_usuario_actual



def _serializar_pago(p: models.Pago) -> dict:
    return {
        "id":             p.id,
        "reserva_id":     p.reserva_id,
        "subtotal":       float(p.subtotal),
        "costo_envio":    float(p.costo_envio),
        "monto":          float(p.monto),
        "estado":         p.estado,
        "tipo":           p.tipo,
        "referencia_ext": p.referencia_ext,
        "metodo":         p.metodo,
        "fecha":          p.fecha.isoformat() if p.fecha else None,
        # RF-46
        "comision_pct":   p.comision_pct,
        "comision_monto": float(p.comision_monto),
        "monto_neto":     float(p.monto_neto),
    }


def _calcular_totales_reserva(reserva: models.Reserva) -> dict:
    """
    Calcula el subtotal y el costo de envío de UNA reserva completa (no de
    un pago individual). El costo de envío se calcula una sola vez sobre el
    subtotal total, para que no se le cobre de más si el comprador paga en
    varias cuotas (RF-27) — el envío se cobra completo en el primer abono.
    """
    precio_kg = reserva.lote.precio_kg or 0
    subtotal = round(float(precio_kg) * reserva.cantidad, 2)
    if subtotal <= 0:
        subtotal = 0.01  # evita valores en 0/negativos si el lote no tiene precio cargado

    # Costo de envío SIMPLIFICADO (no hay integración con transportista real
    # todavía): 5% del subtotal, con un mínimo fijo. Es un valor razonable
    # para completar el desglose del RF-21, no una cotización real de flete.
    costo_envio = max(round(subtotal * 0.05, 2), 3.00)

    return {"subtotal": subtotal, "costo_envio": costo_envio, "total": round(subtotal + costo_envio, 2)}


def _monto_pagado(db: Session, reserva_id: int) -> float:
    pagos_aprobados = (
        db.query(models.Pago)
        .filter(models.Pago.reserva_id == reserva_id, models.Pago.estado == "Aprobado")
        .all()
    )
    return round(sum(float(p.monto) for p in pagos_aprobados), 2)


def _validar_monto_pago(datos_monto, reserva: models.Reserva, totales: dict, pagado_hasta_ahora: float, pendiente: float):
    """
    RF-27: el anticipo lo configura el PRODUCTOR (Lote.anticipo_pct), no el
    comprador — así que no se acepta cualquier monto parcial. Solo dos
    abonos posibles: el anticipo exacto (primer pago) y el saldo exacto
    (segundo pago). Si el lote no tiene anticipo configurado, no se
    permiten pagos parciales en absoluto.

    Devuelve un mensaje de error (string) si el monto no es válido, o None
    si está todo bien — así el caller decide cómo responder sin que esta
    función mezcle validación con la respuesta HTTP.
    """
    if datos_monto is None or round(datos_monto, 2) == pendiente:
        return None  # paga todo lo pendiente: siempre válido

    if reserva.lote.anticipo_pct is None:
        return "Este lote no tiene anticipo configurado por el productor — solo se puede pagar el total."

    if pagado_hasta_ahora > 0:
        return f"Ya se pagó el anticipo de esta reserva. El siguiente pago debe ser el saldo completo: ${pendiente:,.2f}."

    monto_anticipo_esperado = round(totales["total"] * reserva.lote.anticipo_pct / 100, 2)
    if round(datos_monto, 2) != monto_anticipo_esperado:
        return (
            f"El anticipo configurado por el productor es {reserva.lote.anticipo_pct}% "
            f"(${monto_anticipo_esperado:,.2f}). Envía ese monto exacto, o el total (${pendiente:,.2f})."
        )
    return None


def _distribuir_monto_pago(monto: float, pagado_hasta_ahora: float, totales: dict) -> tuple:
    """
    El envío se cobra completo en el primer abono; los siguientes abonos
    son puro producto (subtotal), para no cobrarlo dos veces. Devuelve
    (subtotal_este_pago, costo_envio_este_pago).
    """
    envio_ya_cobrado = pagado_hasta_ahora >= totales["costo_envio"]
    if envio_ya_cobrado:
        return monto, 0.0
    costo_envio_este_pago = min(monto, totales["costo_envio"])
    return round(monto - costo_envio_este_pago, 2), costo_envio_este_pago


def _tipo_de_pago(monto: float, pagado_hasta_ahora: float, total: float) -> str:
    """Clasifica el pago como Completo / Anticipo / Saldo, para dejarlo en BD."""
    es_pago_total = round(pagado_hasta_ahora + monto, 2) >= total
    if pagado_hasta_ahora > 0:
        return "Saldo"
    return "Completo" if es_pago_total else "Anticipo"


# ── POST /pagos ─────────────────────────────────────────────────────────────
# SIMULA el pago de una reserva "Confirmada": no hay pasarela real conectada,
# cada pago queda "Aprobado" de inmediato.
#
# RF-27: soporta pago parcial/anticipo. Si `datos.monto` viene vacío, se
# cobra el total pendiente de una vez (comportamiento de siempre). Si viene
# con un valor menor al total, se registra como un abono — la reserva sigue
# "Confirmada" (para poder seguir abonando) y solo pasa a "Pagada" cuando la
# suma de los pagos aprobados cubre el total.

def crear_pago(
    datos: PagoCrear,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(requiere_rol("Comprador")),
):
    reserva = db.query(models.Reserva).filter(models.Reserva.id == datos.reserva_id).first()
    if not reserva:
        raise ErrorReservaNoEncontrada(datos.reserva_id)

    if reserva.comprador_id != usuario_actual.id:
        raise ErrorNoAutorizado(["Administrador"])

    if reserva.estado != "Confirmada":
        raise ErrorReservaNoPagable(reserva.estado)

    totales = _calcular_totales_reserva(reserva)
    pagado_hasta_ahora = _monto_pagado(db, reserva.id)
    pendiente = round(totales["total"] - pagado_hasta_ahora, 2)

    if pendiente <= 0:
        # No debería pasar (la reserva ya habría quedado "Pagada"), pero por
        # si acaso dos pestañas mandan el pago casi al mismo tiempo.
        raise ErrorReservaNoPagable(reserva.estado)

    error_monto = _validar_monto_pago(datos.monto, reserva, totales, pagado_hasta_ahora, pendiente)
    if error_monto:
        return respuesta_error(error_monto, status_code=400)

    monto = round(datos.monto, 2) if datos.monto is not None else pendiente
    if monto <= 0:
        return respuesta_error("El monto del pago debe ser mayor a 0.", status_code=400)
    if monto > pendiente:
        return respuesta_error(
            f"El monto (${monto:,.2f}) supera lo pendiente (${pendiente:,.2f}) de esta reserva.",
            status_code=400,
        )

    tipo_pago = _tipo_de_pago(monto, pagado_hasta_ahora, totales["total"])
    subtotal_este_pago, costo_envio_este_pago = _distribuir_monto_pago(monto, pagado_hasta_ahora, totales)

    nuevo_id = siguiente_id(db, models.Pago)

    # RF-46: comisión de la plataforma sobre esta transacción. Se usa el %
    # vigente ahora mismo — si el Admin lo cambia después, este pago ya
    # queda con el que se le aplicó (ver comentario en Modelos/modelos_pagos.py).
    config = obtener_configuracion(db)
    comision_monto = round(monto * config.comision_pct / 100, 2)
    monto_neto = round(monto - comision_monto, 2)

    nuevo = models.Pago(
        id=nuevo_id,
        reserva_id=reserva.id,
        subtotal=subtotal_este_pago,
        costo_envio=costo_envio_este_pago,
        monto=monto,
        estado="Aprobado",
        tipo=tipo_pago,
        referencia_ext=f"SIM-{reserva.id}-{nuevo_id}",
        metodo=datos.metodo,
        comision_pct=config.comision_pct,
        comision_monto=comision_monto,
        monto_neto=monto_neto,
    )
    db.add(nuevo)

    es_pago_completo = round(pagado_hasta_ahora + monto, 2) >= totales["total"]
    if es_pago_completo:
        reserva.estado = "Pagada"
        db.add(models.HistorialReserva(reserva_id=reserva.id, estado="Pagada"))
        mensaje_notif = f"Se confirmó el pago completo de ${totales['total']:,.2f} por la reserva #{reserva.id} ({reserva.lote.producto})."
    else:
        nuevo_pendiente = round(totales["total"] - pagado_hasta_ahora - monto, 2)
        mensaje_notif = (
            f"Se recibió un abono de ${monto:,.2f} por la reserva #{reserva.id} ({reserva.lote.producto}). "
            f"Quedan ${nuevo_pendiente:,.2f} pendientes."
        )

    # RF-35: notificar al productor que la pasarela confirmó el pago (o abono).
    crear_notificacion(
        db, reserva.lote.productor_id, "PagoRecibido", mensaje_notif,
        entidad_tipo="reserva", entidad_id=reserva.id,
    )

    db.commit()
    db.refresh(nuevo)

    return respuesta_ok(
        message=(
            "Pago simulado y aprobado correctamente. La reserva quedó en estado 'Pagada'."
            if es_pago_completo else
            f"Abono registrado. Pendiente: ${round(totales['total'] - pagado_hasta_ahora - monto, 2):,.2f}."
        ),
        data={
            **_serializar_pago(nuevo),
            "monto_total_reserva": totales["total"],
            "monto_pendiente": round(max(totales["total"] - pagado_hasta_ahora - monto, 0), 2),
            "reserva_completamente_pagada": es_pago_completo,
        },
        status_code=201,
    )


# ── GET /pagos ───────────────────────────────────────────────────────────────
# Historial de pagos de una reserva. Solo puede verlo el comprador dueño de la
# reserva, el productor dueño del lote, o un Administrador.

def obtener_pagos(
    reserva_id: int = Query(..., description="Id de la reserva"),
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(obtener_usuario_actual),
):
    reserva = db.query(models.Reserva).filter(models.Reserva.id == reserva_id).first()
    if not reserva:
        raise ErrorReservaNoEncontrada(reserva_id)

    rol = usuario_actual.rol_rel.nombre if usuario_actual.rol_rel else None
    es_dueño = (
        (rol == "Comprador" and reserva.comprador_id == usuario_actual.id)
        or (rol == "Productor" and reserva.lote.productor_id == usuario_actual.id)
    )
    if rol != "Administrador" and not es_dueño:
        raise ErrorNoAutorizado(["Administrador"])

    pagos = db.query(models.Pago).filter(models.Pago.reserva_id == reserva_id).order_by(models.Pago.fecha.desc()).all()

    # RF-27: resumen de saldo, para que el frontend sepa cuánto falta y si
    # este lote tiene anticipo configurado por el productor.
    totales = _calcular_totales_reserva(reserva)
    pagado = _monto_pagado(db, reserva_id)
    anticipo_pct = reserva.lote.anticipo_pct

    return respuesta_ok(
        message="Pagos obtenidos correctamente",
        data={
            "monto_total_reserva": totales["total"],
            "monto_pagado": pagado,
            "monto_pendiente": round(max(totales["total"] - pagado, 0), 2),
            "anticipo_pct": anticipo_pct,
            "monto_anticipo": round(totales["total"] * anticipo_pct / 100, 2) if anticipo_pct else None,
            "pagos": [_serializar_pago(p) for p in pagos],
        },
    )
