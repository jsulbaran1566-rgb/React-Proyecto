import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';

export const TIPOS_DOCUMENTO_VALIDOS = ['CC', 'NIT', 'CE', 'PP'] as const;
export const ROLES_VALIDOS = ['Administrador', 'Productor', 'Comprador'] as const;
export const ESTADOS_USUARIO_VALIDOS = ['Activo', 'Inactivo'] as const;

export type TipoDocumento = (typeof TIPOS_DOCUMENTO_VALIDOS)[number];
export type NombreRol = (typeof ROLES_VALIDOS)[number];
export type EstadoUsuario = (typeof ESTADOS_USUARIO_VALIDOS)[number];

// Forma real que devuelve el backend (_serializar_usuario en
// Controladores/controladores_usuarios.py)
export interface Usuario {
  id: number;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string | null;
  ciudad: string | null;
  empresa: string | null;
  rol_id: number;
  rol: NombreRol | null;
  estado: EstadoUsuario;
  fecha_registro: string;
  foto_url: string | null;
  descripcion: string | null;
  nombre_finca: string | null;
  cultivos_principales: string | null;
  latitud: number | null;
  longitud: number | null;
}

export interface FiltrosUsuarios {
  rol_id?: number;
  estado?: EstadoUsuario;
}

// GET /usuarios
export async function obtenerUsuarios(filtros: FiltrosUsuarios = {}): Promise<Usuario[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Usuario[]>>('/usuarios', { params: filtros });
  return desempaquetar(respuesta.data);
}

// GET /usuarios/compradores (solo Administrador)
export async function obtenerCompradores(estado?: EstadoUsuario): Promise<Usuario[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Usuario[]>>('/usuarios/compradores', {
    params: estado ? { estado } : undefined,
  });
  return desempaquetar(respuesta.data);
}

// GET /usuarios/productores
export async function obtenerProductores(estado?: EstadoUsuario): Promise<Usuario[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Usuario[]>>('/usuarios/productores', {
    params: estado ? { estado } : undefined,
  });
  return desempaquetar(respuesta.data);
}

// GET /usuarios/{nombre} — búsqueda parcial por nombre (solo Administrador)
export async function buscarUsuariosPorNombre(nombre: string): Promise<Usuario[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Usuario[]>>(
    `/usuarios/${encodeURIComponent(nombre)}`
  );
  return desempaquetar(respuesta.data);
}

export interface UsuarioCrear {
  id: number;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  nombre: string;
  correo: string;
  telefono: string;
  clave: string;
  direccion?: string;
  ciudad?: string;
  empresa?: string;
  rol_id: number;
  estado?: EstadoUsuario;
}

// POST /usuarios
export async function crearUsuario(datos: UsuarioCrear): Promise<Usuario> {
  const respuesta = await httpClient.post<ApiEnvelope<Usuario>>('/usuarios', datos);
  return desempaquetar(respuesta.data);
}

export interface UsuarioEditar {
  tipo_documento?: TipoDocumento;
  nombre?: string;
  correo?: string;
  telefono?: string;
  clave?: string;
  direccion?: string;
  ciudad?: string;
  rol_id?: number;
  estado?: EstadoUsuario;
  foto_url?: string;
  descripcion?: string;
  // RF-06 — perfil de finca, solo aplica si el usuario destino es Productor
  nombre_finca?: string;
  cultivos_principales?: string;
  latitud?: number;
  longitud?: number;
}

// PUT /usuarios/{id}
export async function actualizarUsuario(id: number, datos: UsuarioEditar): Promise<Usuario> {
  const respuesta = await httpClient.put<ApiEnvelope<Usuario>>(`/usuarios/${id}`, datos);
  return desempaquetar(respuesta.data);
}

// DELETE /usuarios/{id}?confirmar=true (solo Administrador)
export async function eliminarUsuario(id: number): Promise<{ id: number; nombre: string }> {
  const respuesta = await httpClient.delete<ApiEnvelope<{ id: number; nombre: string }>>(
    `/usuarios/${id}`,
    { params: { confirmar: true } }
  );
  return desempaquetar(respuesta.data);
}

export interface PerfilPublicoProductor {
  id: number;
  nombre: string;
  foto_url: string | null;
  descripcion: string | null;
  nombre_finca: string | null;
  cultivos_principales: string | null;
  latitud: number | null;
  longitud: number | null;
  ciudad: string | null;
  miembro_desde: string;
  lotes_activos: number;
  promedio_calificacion: number | null;
  total_calificaciones: number;
  tasa_cumplimiento: number | null;
  puntaje: number | null;
}

// GET /usuarios/{id}/perfil-publico — RF-48, público, sin sesión
export async function obtenerPerfilPublico(id: number): Promise<PerfilPublicoProductor> {
  const respuesta = await httpClient.get<ApiEnvelope<PerfilPublicoProductor>>(
    `/usuarios/${id}/perfil-publico`
  );
  return desempaquetar(respuesta.data);
}
