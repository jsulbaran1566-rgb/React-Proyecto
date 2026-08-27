import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';

// Forma real que devuelve _serializar_notificacion() en
// Controladores/controladores_notificaciones.py
export interface Notificacion {
  id: number;
  tipo: string;
  mensaje: string;
  leida: boolean;
  fecha: string;
  entidad_tipo: string | null;
  entidad_id: number | null;
}

// GET /notificaciones devuelve un resumen con conteo de no leídas, no un
// array plano.
export interface ResumenNotificaciones {
  no_leidas: number;
  notificaciones: Notificacion[];
}

// GET /notificaciones (del usuario autenticado)
export async function obtenerNotificaciones(): Promise<ResumenNotificaciones> {
  const respuesta = await httpClient.get<ApiEnvelope<ResumenNotificaciones>>('/notificaciones');
  return desempaquetar(respuesta.data);
}

// PUT /notificaciones/{id}/leer
export async function marcarNotificacionLeida(id: number): Promise<Notificacion> {
  const respuesta = await httpClient.put<ApiEnvelope<Notificacion>>(
    `/notificaciones/${id}/leer`
  );
  return desempaquetar(respuesta.data);
}

// PUT /notificaciones/leer-todas
export async function marcarTodasLeidas(): Promise<void> {
  const respuesta = await httpClient.put<ApiEnvelope<null>>('/notificaciones/leer-todas');
  desempaquetar(respuesta.data);
}
