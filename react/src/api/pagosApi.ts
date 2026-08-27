import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';

export const METODOS_PAGO_VALIDOS = [
  'Simulado - Tarjeta',
  'Simulado - PSE',
  'Simulado - Efectivo',
] as const;
export type MetodoPago = (typeof METODOS_PAGO_VALIDOS)[number];

// Forma real que devuelve _serializar_pago() en Controladores/controladores_pagos.py
export interface Pago {
  id: number;
  reserva_id: number;
  subtotal: number;
  costo_envio: number;
  monto: number;
  estado: 'Aprobado' | 'Reembolsado';
  tipo: 'Completo' | 'Anticipo' | 'Saldo';
  referencia_ext: string;
  metodo: MetodoPago;
  fecha: string | null;
  comision_pct: number;
  comision_monto: number;
  monto_neto: number;
}

// GET /pagos devuelve un resumen de saldo de la reserva, no un array plano.
export interface ResumenPagosReserva {
  monto_total_reserva: number;
  monto_pagado: number;
  monto_pendiente: number;
  anticipo_pct: number | null;
  monto_anticipo: number | null;
  pagos: Pago[];
}

// GET /pagos?reserva_id= (obligatorio). Solo comprador dueño, productor del
// lote o Administrador.
export async function obtenerPagos(reservaId: number): Promise<ResumenPagosReserva> {
  const respuesta = await httpClient.get<ApiEnvelope<ResumenPagosReserva>>('/pagos', {
    params: { reserva_id: reservaId },
  });
  return desempaquetar(respuesta.data);
}

export interface PagoCrear {
  reserva_id: number;
  metodo: MetodoPago;
  // RF-27: si se omite, cobra el total pendiente de una vez. Si se manda
  // un valor menor (el anticipo exacto configurado por el productor), se
  // registra como abono.
  monto?: number;
}

export interface RespuestaPagoCreado extends Pago {
  monto_total_reserva: number;
  monto_pendiente: number;
  reserva_completamente_pagada: boolean;
}

// POST /pagos — SIMULA el pago de una reserva 'Confirmada' (solo Comprador,
// dueño de la reserva). Queda 'Aprobado' de inmediato.
export async function crearPago(datos: PagoCrear): Promise<RespuestaPagoCreado> {
  const respuesta = await httpClient.post<ApiEnvelope<RespuestaPagoCreado>>('/pagos', datos);
  return desempaquetar(respuesta.data);
}
