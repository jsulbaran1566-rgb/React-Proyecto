import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';

// Forma real que devuelve _serializar_favorito() en
// Controladores/controladores_favoritos.py
export interface Favorito {
  comprador_id: number;
  productor_id: number;
  productor: string;
  ciudad: string | null;
  fecha_agregado: string;
}

// GET /favoritos?comprador_id= — solo rol Comprador, y debe ser su propio id
export async function obtenerFavoritos(compradorId: number): Promise<Favorito[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Favorito[]>>('/favoritos', {
    params: { comprador_id: compradorId },
  });
  return desempaquetar(respuesta.data);
}

// POST /favoritos — comprador_id lo fuerza el backend al usuario autenticado
export async function agregarFavorito(productorId: number): Promise<Favorito> {
  const respuesta = await httpClient.post<ApiEnvelope<Favorito>>('/favoritos', {
    productor_id: productorId,
  });
  return desempaquetar(respuesta.data);
}

// DELETE /favoritos/{comprador_id}/{productor_id}?confirmar=true
export async function quitarFavorito(compradorId: number, productorId: number): Promise<void> {
  const respuesta = await httpClient.delete<ApiEnvelope<null>>(
    `/favoritos/${compradorId}/${productorId}`,
    { params: { confirmar: true } }
  );
  desempaquetar(respuesta.data);
}
