import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';

export const ESTADOS_DISPUTA_VALIDOS = ['Abierta', 'En revisión', 'Resuelta', 'Cerrada'] as const;
export type EstadoDisputa = (typeof ESTADOS_DISPUTA_VALIDOS)[number];

// Forma real que devuelve _serializar_disputa() en Controladores/controladores_disputas.py
export interface Disputa {
  id: number;
  reserva_id: number;
  comprador_id: number;
  estado: EstadoDisputa;
  descripcion: string;
  resolucion: string | null;
  fecha_apertura: string | null;
  fecha_resolucion: string | null;
}

// GET /disputas (Administrador ve todas; Comprador solo las suyas)
export async function obtenerDisputas(estado?: EstadoDisputa): Promise<Disputa[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Disputa[]>>('/disputas', {
    params: estado ? { estado } : undefined,
  });
  return desempaquetar(respuesta.data);
}

export interface DisputaCrear {
  reserva_id: number;
  descripcion: string;
}

// POST /disputas — solo Comprador, sobre su propia reserva, máximo una por reserva
export async function crearDisputa(datos: DisputaCrear): Promise<Disputa> {
  const respuesta = await httpClient.post<ApiEnvelope<Disputa>>('/disputas', datos);
  return desempaquetar(respuesta.data);
}

export interface DisputaActualizar {
  estado: EstadoDisputa;
  resolucion?: string;
  // RF-25/38: si es true, marca el pago de la reserva como Reembolsado
  reembolsar?: boolean;
}

// PUT /disputas/{id} — solo Administrador
export async function actualizarDisputa(id: number, datos: DisputaActualizar): Promise<Disputa> {
  const respuesta = await httpClient.put<ApiEnvelope<Disputa>>(`/disputas/${id}`, datos);
  return desempaquetar(respuesta.data);
}
