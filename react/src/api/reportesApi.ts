import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';

export interface ResumenCalificacion {
  promedio: number | null;
  total: number;
  tasa_cumplimiento: number | null;
  puntaje: number | null;
}

// GET /reportes/productor — RF-39 (rol Productor o Administrador)
export interface ReporteProductor {
  productor_id: number;
  rango: { desde: string | null; hasta: string | null };
  total_kg_vendidos: number;
  ingresos_totales: number;
  comision_total: number;
  ingresos_netos: number;
  lotes_activos: number;
  reservas_entregadas: number;
  calificacion: ResumenCalificacion;
}

export interface FiltrosReporteProductor {
  productor_id?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export async function obtenerReporteProductor(
  filtros: FiltrosReporteProductor = {}
): Promise<ReporteProductor> {
  const respuesta = await httpClient.get<ApiEnvelope<ReporteProductor>>('/reportes/productor', {
    params: filtros,
  });
  return desempaquetar(respuesta.data);
}

// GET /reportes/comprador — RF-40 (rol Comprador o Administrador)
export interface ItemHistorialCompra {
  reserva_id: number;
  producto: string | null;
  productor: string | null;
  cantidad: number;
  estado: string;
  fecha: string;
  monto_pagado: number | null;
}

export interface ReporteComprador {
  comprador_id: number;
  total_reservas: number;
  total_gastado: number;
  historial: ItemHistorialCompra[];
}

export async function obtenerReporteComprador(compradorId?: number): Promise<ReporteComprador> {
  const respuesta = await httpClient.get<ApiEnvelope<ReporteComprador>>('/reportes/comprador', {
    params: compradorId ? { comprador_id: compradorId } : undefined,
  });
  return desempaquetar(respuesta.data);
}

// GET /reportes/admin — RF-41 (solo Administrador)
export interface ReporteAdmin {
  rango: { desde: string | null; hasta: string | null };
  volumen_transacciones: number;
  monto_total_transacciones: number;
  comision_total_plataforma: number;
  disputas_por_estado: Record<string, number>;
  total_disputas: number;
  usuarios_activos_por_rol: Record<string, number>;
  total_usuarios_activos: number;
}

export interface FiltrosReporteAdmin {
  fecha_desde?: string;
  fecha_hasta?: string;
}

export async function obtenerReporteAdmin(
  filtros: FiltrosReporteAdmin = {}
): Promise<ReporteAdmin> {
  const respuesta = await httpClient.get<ApiEnvelope<ReporteAdmin>>('/reportes/admin', {
    params: filtros,
  });
  return desempaquetar(respuesta.data);
}
