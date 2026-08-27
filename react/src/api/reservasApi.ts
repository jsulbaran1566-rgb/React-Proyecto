import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';

// Estados válidos según Esquemas/esquemas_reservas.py
export type EstadoReserva =
  | 'Pendiente'
  | 'Confirmada'
  | 'Pagada'
  | 'En tránsito'
  | 'Entregada'
  | 'Calificada'
  | 'Cancelada';

// Forma real que devuelve _serializar_reserva() en
// Controladores/controladores_reservas.py
export interface Reserva {
  id: number;
  comprador_id: number;
  comprador: string;
  lote_id: number;
  producto: string;
  productor_id: number;
  productor: string | null;
  precio_kg: number | null;
  cantidad: number;
  fecha: string;
  estado: EstadoReserva;
  motivo_cancelacion: string | null;
  fecha_limite_pago: string | null;
  estado_cultivo: 'Siembra' | 'Crecimiento' | 'Listo' | 'Cosechado';
  fecha_cosecha: string | null;
  anticipo_pct: number | null;
}

export interface FiltrosReservas {
  estado?: EstadoReserva;
  comprador_id?: number;
  lote_id?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
}

// GET /reservas (requiere sesión, cualquier rol)
export async function obtenerReservas(filtros: FiltrosReservas = {}): Promise<Reserva[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Reserva[]>>('/reservas', {
    params: filtros,
  });
  return desempaquetar(respuesta.data);
}

// GET /reservas/fechas — fecha_desde y fecha_hasta obligatorios
export async function obtenerReservasPorFecha(
  fechaDesde: string,
  fechaHasta: string
): Promise<Reserva[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Reserva[]>>('/reservas/fechas', {
    params: { fecha_desde: fechaDesde, fecha_hasta: fechaHasta },
  });
  return desempaquetar(respuesta.data);
}

export interface ReservaCrear {
  comprador_id: number;
  lote_id: number;
  cantidad: number;
}

// POST /reservas — solo rol Comprador. comprador_id lo fuerza el backend
// al usuario autenticado (se ignora lo que venga en el body).
export async function crearReserva(datos: ReservaCrear): Promise<Reserva> {
  const respuesta = await httpClient.post<ApiEnvelope<Reserva>>('/reservas', datos);
  return desempaquetar(respuesta.data);
}

export interface ReservaEditar {
  comprador_id?: number;
  fecha?: string;
  estado?: EstadoReserva;
  // Obligatorio cuando estado === 'Cancelada' (validado en el controlador)
  motivo_cancelacion?: string;
}

// PUT /reservas/{id}/estado
export async function actualizarEstadoReserva(
  id: number,
  datos: ReservaEditar
): Promise<Reserva> {
  const respuesta = await httpClient.put<ApiEnvelope<Reserva>>(`/reservas/${id}/estado`, datos);
  return desempaquetar(respuesta.data);
}

// DELETE /reservas/{id}?confirmar=true — solo si estado === 'Cancelada'
export async function eliminarReserva(id: number): Promise<void> {
  const respuesta = await httpClient.delete<ApiEnvelope<null>>(`/reservas/${id}`, {
    params: { confirmar: true },
  });
  desempaquetar(respuesta.data);
}
