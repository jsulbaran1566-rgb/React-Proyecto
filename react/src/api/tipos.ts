// Sobre de respuesta que usan TODOS los endpoints normales del backend.
// Fuente: Utilidades/respuesta.py (respuesta_ok / respuesta_error).
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: string | null;
}
