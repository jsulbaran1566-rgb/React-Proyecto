from datetime import datetime, timedelta
from fastapi import Depends
from sqlalchemy.orm import Session
from Conexion.database import get_db
import Modelos.models as models
from Excepciones.excepciones_notificaciones import ErrorNotificacionNoEncontrada
from Excepciones.excepciones_auth import ErrorNoAutorizado
from Utilidades.respuesta import respuesta_ok
from Utilidades.ids import siguiente_id
from Utilidades.logger import logger
from Dependencias.dependencias import obtener_usuario_actual


# ── Helper interno — lo usan otros controladores, no es un endpoint ───────────
# (crear_reserva, actualizar_estado_cultivo, crear_pago, etc.)

def crear_notificacion(
    db: Session,
    usuario_id: int,
    tipo: str,
    mensaje: str,
    entidad_tipo: str = None,
    entidad_id: int = None,
) -> None:
    db.add(models.Notificacion(
        id=siguiente_id(db, models.Notificacion),
        usuario_id=usuario_id,
        tipo=tipo,
        mensaje=mensaje,
        entidad_tipo=entidad_tipo,
        entidad_id=entidad_id,
    ))


def _serializar_notificacion(n: models.Notificacion) -> dict:
    return {
        "id":           n.id,
        "tipo":         n.tipo,
        "mensaje":      n.mensaje,
        "leida":        n.leida,
        "fecha":        n.fecha.isoformat(),
        "entidad_tipo": n.entidad_tipo,
        "entidad_id":   n.entidad_id,
    }


# ── RF-36: recordatorio de entrega próxima ────────────────────────────────────
# No hay scheduler/cron en este proyecto, así que este recordatorio no se
# "dispara" solo en segundo plano. En su lugar, cada vez que un usuario
# consulta sus notificaciones, revisamos si alguna de SUS entregas pendientes
# entra en la ventana de 48h y, si no se le avisó antes, se lo notificamos en
# ese momento (lazy trigger). Es una simplificación honesta del RF-36.

def _generar_recordatorios_entrega(db: Session, usuario_id: int) -> None:
    limite = datetime.now() + timedelta(hours=48)

    entregas_proximas = (
        db.query(models.Entrega)
        .join(models.Reserva, models.Entrega.reserva_id == models.Reserva.id)
        .filter(
            models.Entrega.estado != "Entregada",
            models.Entrega.fecha_estimada != None,  # noqa: E711
            models.Entrega.fecha_estimada <= limite.date(),
        )
        .all()
    )

    for entrega in entregas_proximas:
        reserva = entrega.reserva
        destinatarios = {reserva.comprador_id, reserva.lote.productor_id}
        if usuario_id not in destinatarios:
            continue

        ya_avisado = (
            db.query(models.Notificacion)
            .filter(
                models.Notificacion.usuario_id == usuario_id,
                models.Notificacion.tipo == "RecordatorioEntrega",
                models.Notificacion.entidad_tipo == "entrega",
                models.Notificacion.entidad_id == entrega.id,
            )
            .first()
        )
        if ya_avisado:
            continue

        crear_notificacion(
            db, usuario_id, "RecordatorioEntrega",
            f"La entrega de la reserva #{reserva.id} ({reserva.lote.producto}) está programada para "
            f"el {entrega.fecha_estimada} — menos de 48h.",
            entidad_tipo="entrega", entidad_id=entrega.id,
        )


# ── GET /notificaciones ────────────────────────────────────────────────────────

def obtener_notificaciones(
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(obtener_usuario_actual),
):
    try:
        _generar_recordatorios_entrega(db, usuario_actual.id)
        db.commit()
    except Exception:
        # Si el chequeo de recordatorios falla, no debe tumbar la consulta
        # de notificaciones normales — solo lo dejamos en el log.
        db.rollback()
        logger.exception("Fallo generando recordatorios de entrega (RF-36)")

    notificaciones = (
        db.query(models.Notificacion)
        .filter(models.Notificacion.usuario_id == usuario_actual.id)
        .order_by(models.Notificacion.fecha.desc())
        .all()
    )
    no_leidas = sum(1 for n in notificaciones if not n.leida)

    return respuesta_ok(
        message="Notificaciones obtenidas correctamente",
        data={
            "no_leidas": no_leidas,
            "notificaciones": [_serializar_notificacion(n) for n in notificaciones],
        },
    )


# ── PUT /notificaciones/{id}/leer ────────────────────────────────────────────

def marcar_notificacion_leida(
    id: int,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(obtener_usuario_actual),
):
    notificacion = db.query(models.Notificacion).filter(models.Notificacion.id == id).first()
    if not notificacion:
        raise ErrorNotificacionNoEncontrada(id)
    if notificacion.usuario_id != usuario_actual.id:
        raise ErrorNoAutorizado(["Administrador"])

    notificacion.leida = True
    db.commit()

    return respuesta_ok(message="Notificación marcada como leída", data=_serializar_notificacion(notificacion))


# ── PUT /notificaciones/leer-todas ───────────────────────────────────────────

def marcar_todas_leidas(
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(obtener_usuario_actual),
):
    db.query(models.Notificacion).filter(
        models.Notificacion.usuario_id == usuario_actual.id,
        models.Notificacion.leida == False,  # noqa: E712
    ).update({"leida": True})
    db.commit()

    return respuesta_ok(message="Todas las notificaciones fueron marcadas como leídas")
