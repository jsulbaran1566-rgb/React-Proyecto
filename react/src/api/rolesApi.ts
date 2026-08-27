import { httpClient, desempaquetar } from './httpClient';
import type { ApiEnvelope } from './tipos';

// Forma real que devuelve _serializar_rol() en Controladores/controladores_roles.py
export interface Rol {
  id: number;
  nombre: string;
  descripcion: string | null;
  permisos: string | null;
}

// GET /roles
export async function obtenerRoles(): Promise<Rol[]> {
  const respuesta = await httpClient.get<ApiEnvelope<Rol[]>>('/roles');
  return desempaquetar(respuesta.data);
}

// GET /roles/{id}
export async function obtenerRolPorId(id: number): Promise<Rol> {
  const respuesta = await httpClient.get<ApiEnvelope<Rol>>(`/roles/${id}`);
  return desempaquetar(respuesta.data);
}

export interface RolCrear {
  // El backend no autogenera el id de rol: hay que indicarlo explícitamente.
  id: number;
  nombre: string;
  descripcion?: string;
  permisos?: string;
}

// POST /roles — solo Administrador
export async function crearRol(datos: RolCrear): Promise<Rol> {
  const respuesta = await httpClient.post<ApiEnvelope<Rol>>('/roles', datos);
  return desempaquetar(respuesta.data);
}

export interface RolEditar {
  nombre?: string;
  descripcion?: string;
  permisos?: string;
}

// PUT /roles/{id} — solo Administrador
export async function actualizarRol(id: number, datos: RolEditar): Promise<Rol> {
  const respuesta = await httpClient.put<ApiEnvelope<Rol>>(`/roles/${id}`, datos);
  return desempaquetar(respuesta.data);
}

// DELETE /roles/{id}?confirmar=true — solo Administrador, falla si tiene usuarios asignados
export async function eliminarRol(id: number): Promise<void> {
  const respuesta = await httpClient.delete<ApiEnvelope<null>>(`/roles/${id}`, {
    params: { confirmar: true },
  });
  desempaquetar(respuesta.data);
}
