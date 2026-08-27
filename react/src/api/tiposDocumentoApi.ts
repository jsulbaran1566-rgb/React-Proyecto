import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';

export interface TipoDocumento {
  codigo: string;
  nombre: string;
}

// GET /tipos_documento
export async function obtenerTiposDocumento(): Promise<TipoDocumento[]> {
  const respuesta = await httpClient.get<ApiEnvelope<TipoDocumento[]>>('/tipos_documento');
  return desempaquetar(respuesta.data);
}
