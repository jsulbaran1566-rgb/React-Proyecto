from fastapi import APIRouter
from Controladores.controladores_pagos import crear_pago, obtener_pagos

router = APIRouter(prefix="/pagos", tags=["Pagos"])

router.post(
    "",
    summary="Simular pago de una reserva",
    description="SIMULA el pago de una reserva 'Confirmada' (no hay pasarela real conectada). Deja la reserva en estado 'Pagada'.",
)(crear_pago)

router.get(
    "",
    summary="Ver pagos de una reserva",
    description="Lista el historial de pagos de una reserva. Solo el comprador dueño, el productor del lote o un Administrador.",
)(obtener_pagos)
