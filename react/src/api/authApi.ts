import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';
import type { NombreRol } from './usuariosApi';

// El login solo devuelve un subconjunto básico del usuario (ver
// Controladores/controladores_auth.py::iniciar_sesion), no la forma
// completa de GET /usuarios.
export interface UsuarioSesion {
  id: number;
  nombre: string;
  correo: string;
  rol: NombreRol | null;
}

export interface RespuestaLogin {
  token: string;
  usuario: UsuarioSesion;
}

// POST /auth/login
export async function login(correo: string, clave: string): Promise<RespuestaLogin> {
  const respuesta = await httpClient.post<ApiEnvelope<RespuestaLogin>>('/auth/login', {
    correo,
    clave,
  });
  return desempaquetar(respuesta.data);
}

// POST /auth/recuperar-clave
// El backend no tiene SMTP configurado: devuelve el token de recuperación
// directamente en la respuesta (simulado a propósito, no es un bug).
export async function recuperarClave(
  correo: string
): Promise<{ token_recuperacion: string | null; nota: string }> {
  const respuesta = await httpClient.post<
    ApiEnvelope<{ token_recuperacion: string | null; nota: string }>
  >('/auth/recuperar-clave', { correo });
  return desempaquetar(respuesta.data);
}

// POST /auth/restablecer-clave
export async function restablecerClave(token: string, claveNueva: string): Promise<void> {
  const respuesta = await httpClient.post<ApiEnvelope<null>>('/auth/restablecer-clave', {
    token,
    clave_nueva: claveNueva,
  });
  desempaquetar(respuesta.data);
}
