import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';

// Forma que devuelve el backend. Ver _serializar_lote() en
// Controladores/controladores_lotes.py
export interface Lote {
  id: number;
  producto: string;
  cantidad: number;
  kg_reservados: number;
  precio_kg: number | null;
  imagen_url: string | null;
  estado: 'Activo' | 'Inactivo';
  estado_cultivo: 'Siembra' | 'Crecimiento' | 'Listo' | 'Cosechado';
  anticipo_pct: number | null;
  horas_limite_pago: number | null;
  fecha_siembra: string | null;
  fecha_cosecha: string | null;
  categoria: string;
  productor_id: number;
  productor: string;
  ingreso_proyectado_total: number | null;
  ingreso_proyectado_reservado: number | null;
  productor_nombre_finca: string | null;
  productor_cultivos_principales: string | null;
  productor_latitud: number | null;
  productor_longitud: number | null;
}

export interface FiltrosLotes {
  categoria?: string;
  estado?: Lote['estado'];
  productor_id?: number;
  precio_min?: number;
  precio_max?: number;
  cosecha_desde?: string;
  cosecha_hasta?: string;
}

// GET /lotes (con filtros opcionales por query params)
export async function obtenerLotes(filtros: FiltrosLotes = {}): Promise<Lote[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Lote[]>>('/lotes', { params: filtros });
  return desempaquetar(respuesta.data);
}

// GET /lotes/{producto} — búsqueda parcial por nombre de producto
export async function buscarLotesPorProducto(producto: string): Promise<Lote[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Lote[]>>(
    `/lotes/${encodeURIComponent(producto)}`
  );
  return desempaquetar(respuesta.data);
}

export interface LoteCrear {
  producto: string;
  cantidad: number;
  categoria: string;
  productor_id: number;
  estado?: 'Activo' | 'Inactivo';
  fecha_siembra?: string;
  fecha_cosecha?: string;
  precio_kg?: number;
  imagen_url?: string;
  anticipo_pct?: number;
  horas_limite_pago?: number;
}

// POST /lotes
export async function crearLote(datos: LoteCrear): Promise<Lote> {
  const respuesta = await httpClient.post<ApiEnvelope<Lote>>('/lotes', datos);
  return desempaquetar(respuesta.data);
}

// PUT /lotes/{id} — no se puede reasignar productor_id desde aquí
export async function actualizarLote(
  id: number,
  datos: Partial<Omit<LoteCrear, 'productor_id'>>
): Promise<Lote> {
  const respuesta = await httpClient.put<ApiEnvelope<Lote>>(`/lotes/${id}`, datos);
  return desempaquetar(respuesta.data);
}

// DELETE /lotes/{id}?confirmar=true
export async function eliminarLote(id: number): Promise<void> {
  const respuesta = await httpClient.delete<ApiEnvelope<null>>(`/lotes/${id}`, {
    params: { confirmar: true },
  });
  desempaquetar(respuesta.data);
}

// PUT /lotes/{id}/estado-cultivo — RF-13, el estado del cultivo solo avanza
export async function actualizarEstadoCultivo(
  id: number,
  estadoCultivo: Lote['estado_cultivo']
): Promise<Lote> {
  const respuesta = await httpClient.put<ApiEnvelope<Lote>>(`/lotes/${id}/estado-cultivo`, {
    estado_cultivo: estadoCultivo,
  });
  return desempaquetar(respuesta.data);
}

// GET /lotes/{id}/historial — RF-15
export async function obtenerHistorialLote(id: number): Promise<unknown[]> {
  const respuesta = await httpClient.get<ApiEnvelope<unknown[]>>(`/lotes/${id}/historial`);
  return desempaquetar(respuesta.data);
}
