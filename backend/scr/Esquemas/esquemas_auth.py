from pydantic import BaseModel, EmailStr, field_validator


# ================= AUTENTICACION =================

class LoginEntrada(BaseModel):
    correo: EmailStr
    clave: str

    @field_validator("clave")
    @classmethod
    def clave_no_vacia(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("La clave no puede estar vacía")
        return v


class RecuperarClaveEntrada(BaseModel):
    correo: EmailStr


class RestablecerClaveEntrada(BaseModel):
    token: str
    clave_nueva: str

    @field_validator("clave_nueva")
    @classmethod
    def clave_valida(cls, v: str) -> str:
        if len(v.strip()) < 6:
            raise ValueError("La nueva clave debe tener al menos 6 caracteres")
        return v
