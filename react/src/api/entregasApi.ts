import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';

export const ESTADOS_ENTREGA_VALIDOS = ['Pendiente', 'En tránsito', 'Entregada'] as const;
export type EstadoEntrega = (typeof ESTADOS_ENTREGA_VALIDOS)[number];

// Forma real que devuelve _serializar_entrega() en
// Controladores/controladores_entregas.py. codigo_confirmacion solo se
// incluye para el comprador dueño o un Administrador.
export interface Entrega {
  id: number;
  reserva_id: number;
  medio: string;
  estado: EstadoEntrega;
  fecha_estimada: string | null;
  fecha_real: string | null;
  latitud_actual: number | null;
  longitud_actual: number | null;
  ubicacion_actualizada: string | null;
  codigo_confirmacion?: string;
}

// GET /entregas?reserva_id= (obligatorio). Solo comprador dueño, productor
// del lote o Administrador pueden verla.
export async function obtenerEntregas(reservaId: number): Promise<Entrega[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Entrega[]>>('/entregas', {
    params: { reserva_id: reservaId },
  });
  return desempaquetar(respuesta.data);
}

export interface EntregaCrear {
  reserva_id: number;
  medio: string;
  fecha_estimada?: string;
}

// POST /entregas — el Productor despacha una reserva 'Pagada'. Genera un
// código de confirmación de 6 dígitos para el comprador.
export async function crearEntrega(datos: EntregaCrear): Promise<Entrega> {
  const respuesta = await httpClient.post<ApiEnvelope<Entrega>>('/entregas', datos);
  return desempaquetar(respuesta.data);
}

export interface EntregaActualizar {
  // El Comprador manda el código para confirmar recepción.
  codigo_confirmacion?: string;
  // El Productor puede actualizar el estado manualmente.
  estado?: EstadoEntrega;
}

// PUT /entregas/{id}
export async function actualizarEntrega(id: number, datos: EntregaActualizar): Promise<Entrega> {
  const respuesta = await httpClient.put<ApiEnvelope<Entrega>>(`/entregas/${id}`, datos);
  return desempaquetar(respuesta.data);
}

// PUT /entregas/{id}/ubicacion — RF-32, solo mientras está 'En tránsito'
export async function actualizarUbicacionEntrega(
  id: number,
  latitud: number,
  longitud: number
): Promise<Entrega> {
  const respuesta = await httpClient.put<ApiEnvelope<Entrega>>(`/entregas/${id}/ubicacion`, {
    latitud,
    longitud,
  });
  return desempaquetar(respuesta.data);
}
