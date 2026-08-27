import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';
import type { Lote } from './lotesApi';

// GET /categorias devuelve solo el nombre (ver controladores_categorias.py)
export interface Categoria {
  nombre: string;
}

// GET /categorias
export async function obtenerCategorias(): Promise<Categoria[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Categoria[]>>('/categorias');
  return desempaquetar(respuesta.data);
}

export interface FiltrosLotesPorCategoria {
  cantidad_min?: number;
  solo_activos?: boolean;
  limite?: number;
  ordenar?: 'asc' | 'desc';
}

// GET /categorias/{nombre}/lotes
export async function obtenerLotesPorCategoria(
  nombre: string,
  filtros: FiltrosLotesPorCategoria = {}
): Promise<Lote[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Lote[]>>(
    `/categorias/${encodeURIComponent(nombre)}/lotes`,
    { params: filtros }
  );
  return desempaquetar(respuesta.data);
}

// POST /categorias
export async function crearCategoria(nombre: string): Promise<Categoria> {
  const respuesta = await httpClient.post<ApiEnvelope<Categoria>>('/categorias', { nombre });
  return desempaquetar(respuesta.data);
}

// PUT /categorias/{nombre}
export async function renombrarCategoria(nombre: string, nombreNuevo: string): Promise<Categoria> {
  const respuesta = await httpClient.put<ApiEnvelope<Categoria>>(
    `/categorias/${encodeURIComponent(nombre)}`,
    { nombre_nuevo: nombreNuevo }
  );
  return desempaquetar(respuesta.data);
}

// DELETE /categorias/{nombre}
export async function eliminarCategoria(nombre: string): Promise<void> {
  const respuesta = await httpClient.delete<ApiEnvelope<null>>(
    `/categorias/${encodeURIComponent(nombre)}`
  );
  desempaquetar(respuesta.data);
}
