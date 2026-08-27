from typing import Optional
from pydantic import BaseModel, field_validator

METODOS_PAGO_VALIDOS = ["Simulado - Tarjeta", "Simulado - PSE", "Simulado - Efectivo"]


class PagoCrear(BaseModel):
    reserva_id: int
    metodo: str
    # RF-27: si no se manda, se cobra el total pendiente de la reserva de
    # una sola vez (comportamiento de siempre). Si se manda con un valor
    # menor, se registra como abono/anticipo.
    monto: Optional[float] = None

    @field_validator("reserva_id")
    @classmethod
    def id_positivo(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("El reserva_id debe ser un número positivo")
        return v

    @field_validator("metodo")
    @classmethod
    def metodo_valido(cls, v: str) -> str:
        if v not in METODOS_PAGO_VALIDOS:
            raise ValueError(f"Método inválido. Opciones: {METODOS_PAGO_VALIDOS}")
        return v

    @field_validator("monto")
    @classmethod
    def monto_valido(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v <= 0:
            raise ValueError("El monto debe ser mayor a 0")
        return v
