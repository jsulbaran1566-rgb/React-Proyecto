import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';

export interface Comision {
  comision_pct: number;
}

// GET /configuracion/comision — público, sin sesión
export async function obtenerComision(): Promise<Comision> {
  const respuesta = await httpClient.get<ApiEnvelope<Comision>>('/configuracion/comision');
  return desempaquetar(respuesta.data);
}

// PUT /configuracion/comision — solo Administrador (RF-46)
export async function actualizarComision(comisionPct: number): Promise<Comision> {
  const respuesta = await httpClient.put<ApiEnvelope<Comision>>('/configuracion/comision', {
    comision_pct: comisionPct,
  });
  return desempaquetar(respuesta.data);
}
