import type { Usuario } from '../../api/usuariosApi';

// Constantes de los tipos de acción. Usar constantes (en vez de strings
// sueltos) evita errores de tipeo entre el action creator y el reducer.
export const USUARIOS_CARGANDO = 'usuarios/cargando';
export const USUARIOS_EXITO = 'usuarios/exito';
export const USUARIOS_ERROR = 'usuarios/error';

interface UsuariosCargandoAction {
  type: typeof USUARIOS_CARGANDO;
}

interface UsuariosExitoAction {
  type: typeof USUARIOS_EXITO;
  payload: Usuario[];
}

interface UsuariosErrorAction {
  type: typeof USUARIOS_ERROR;
  payload: string;
}

export type UsuariosAction = UsuariosCargandoAction | UsuariosExitoAction | UsuariosErrorAction;
