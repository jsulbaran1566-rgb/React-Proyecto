import axios from 'axios';
import type { AxiosError } from 'axios';
import type { ApiEnvelope } from './tipos';

// Claves usadas en sessionStorage. El backend no tiene endpoint de
// refresh: ante un 401 se cierra sesión de inmediato (ver interceptor).
export const CLAVE_TOKEN = 'ad_token';
export const CLAVE_USUARIO = 'ad_usuario';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000',
  timeout: 15000,
});

// Interceptor de request: agrega el JWT (Bearer) si existe una sesión activa.
httpClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(CLAVE_TOKEN);
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Interceptor de response: si el backend responde 401 (token ausente,
// inválido o expirado — vida única de 120 min, sin refresh), se cierra
// la sesión localmente de inmediato, igual que el legacy.
httpClient.interceptors.response.use(
  (respuesta) => respuesta,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem(CLAVE_TOKEN);
      sessionStorage.removeItem(CLAVE_USUARIO);
    }
    return Promise.reject(error);
  }
);

/**
 * Desempaqueta el sobre { success, message, data, error } y devuelve
 * directamente `data`. Si `success` es false lanza un Error con el
 * mensaje del backend, para poder capturarlo con try/catch en los
 * componentes.
 *
 * Nota: un 500 no controlado usa la clave `ok` en vez de `success`
 * (main.py::manejar_error_generico) — se normaliza aquí también.
 */
export function desempaquetar<T>(sobre: ApiEnvelope<T> & { ok?: boolean }): T {
  const exitoso = sobre.success ?? sobre.ok ?? false;
  if (!exitoso) {
    throw new Error(sobre.error ?? sobre.message ?? 'Error desconocido del servidor');
  }
  return sobre.data as T;
}

/**
 * Convierte cualquier error (Axios o de red) en un mensaje legible para
 * mostrar en pantalla.
 */
export function obtenerMensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const sobre = error.response?.data as ApiEnvelope<unknown> | undefined;
    if (sobre?.error) return sobre.error;
    if (sobre?.message) return sobre.message;
    if (error.response?.status) return `Error del servidor (${error.response.status})`;
    return 'No fue posible conectar con el servidor';
  }
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}
