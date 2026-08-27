from fastapi import APIRouter
from Controladores.controladores_auth import iniciar_sesion, solicitar_recuperacion, restablecer_clave

router = APIRouter(prefix="/auth", tags=["Autenticación"])

router.post(
    "/login",
    summary="Iniciar sesión",
    description="Valida correo y clave, y devuelve un token JWT junto con los datos del usuario.",
)(iniciar_sesion)

router.post(
    "/recuperar-clave",
    summary="Solicitar recuperación de clave",
    description="Genera un token de recuperación de 15 min. SIMULADO: no hay SMTP configurado, el token se devuelve en la respuesta.",
)(solicitar_recuperacion)

router.post(
    "/restablecer-clave",
    summary="Restablecer clave con el token de recuperación",
    description="Recibe el token de recuperación y la nueva clave; la actualiza si el token es válido.",
)(restablecer_clave)