from fastapi import Depends
from sqlalchemy.orm import Session
from Conexion.database import get_db
import Modelos.models as models
from Esquemas.Esquemas import LoginEntrada, RecuperarClaveEntrada, RestablecerClaveEntrada
from Excepciones.excepciones_auth import ErrorCredencialesInvalidas, ErrorTokenRecuperacionInvalido
from Utilidades.respuesta import respuesta_ok
from Utilidades.seguridad import (
    verificar_clave,
    crear_token,
    leer_token,
    hashear_clave,
    MINUTOS_EXPIRACION_RECUPERACION,
)


# ── POST /auth/login ─────────────────────────────────────────────────────────
# Recibe correo y clave, verifica contra la base de datos y devuelve un token.

def iniciar_sesion(
    datos: LoginEntrada,
    db: Session = Depends(get_db),
):
    # 1. Buscar el usuario por correo
    usuario = db.query(models.Usuario).filter(models.Usuario.correo == datos.correo).first()

    # 2. Si no existe, o la clave no coincide, o esta inactivo -> mismo error
    #    (no decimos cual de las tres cosas fallo, por seguridad)
    if not usuario or not verificar_clave(datos.clave, usuario.clave):
        raise ErrorCredencialesInvalidas()

    if usuario.estado != "Activo":
        raise ErrorCredencialesInvalidas()

    # 3. Crear el token con los datos minimos necesarios
    token = crear_token({
        "sub":    str(usuario.id),
        "correo": usuario.correo,
        "rol":    usuario.rol_rel.nombre if usuario.rol_rel else None,
    })

    # 4. Responder con el token y los datos basicos del usuario
    return respuesta_ok(
        message="Inicio de sesión exitoso",
        data={
            "token": token,
            "usuario": {
                "id":     usuario.id,
                "nombre": usuario.nombre,
                "correo": usuario.correo,
                "rol":    usuario.rol_rel.nombre if usuario.rol_rel else None,
            },
        },
    )


# ── POST /auth/recuperar-clave ────────────────────────────────────────────────
# Genera un token de recuperación de vida corta (15 min).
#
# NOTA IMPORTANTE: este proyecto no tiene un servidor de correo (SMTP)
# configurado, así que el token NO se envía por email — se devuelve
# directamente en la respuesta para poder completar el flujo en la entrega
# académica. En un entorno real, este endpoint NUNCA debería responder el
# token; debería enviarlo solo al correo del usuario.
#
# Por seguridad, la respuesta es igual de genérica exista o no el correo
# (evita que alguien use este endpoint para averiguar qué correos están
# registrados).

def solicitar_recuperacion(
    datos: RecuperarClaveEntrada,
    db: Session = Depends(get_db),
):
    usuario = db.query(models.Usuario).filter(models.Usuario.correo == datos.correo).first()

    token_recuperacion = None
    if usuario and usuario.estado == "Activo":
        token_recuperacion = crear_token(
            {"sub": str(usuario.id), "tipo": "recuperacion"},
            minutos=MINUTOS_EXPIRACION_RECUPERACION,
        )

    return respuesta_ok(
        message=(
            "Si el correo está registrado, se generó un enlace de recuperación "
            f"válido por {MINUTOS_EXPIRACION_RECUPERACION} minutos."
        ),
        data={
            "token_recuperacion": token_recuperacion,
            "nota": (
                "SIMULADO: no hay servidor de correo configurado en este proyecto. "
                "En producción este token se enviaría solo por email, nunca en la respuesta."
            ),
        },
    )


# ── POST /auth/restablecer-clave ──────────────────────────────────────────────
# Valida el token de recuperación y guarda la nueva clave (hasheada).

def restablecer_clave(
    datos: RestablecerClaveEntrada,
    db: Session = Depends(get_db),
):
    payload = leer_token(datos.token)
    if not payload or payload.get("tipo") != "recuperacion":
        raise ErrorTokenRecuperacionInvalido()

    usuario_id = payload.get("sub")
    usuario = db.query(models.Usuario).filter(models.Usuario.id == int(usuario_id)).first()
    if not usuario:
        raise ErrorTokenRecuperacionInvalido()

    usuario.clave = hashear_clave(datos.clave_nueva)
    db.commit()

    return respuesta_ok(message="Clave actualizada correctamente. Ya puedes iniciar sesión.")