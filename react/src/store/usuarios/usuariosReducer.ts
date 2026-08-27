import type { Usuario } from '../../api/usuariosApi';
import { USUARIOS_CARGANDO, USUARIOS_EXITO, USUARIOS_ERROR } from './usuariosTypes';
import type { UsuariosAction } from './usuariosTypes';

export interface UsuariosState {
  lista: Usuario[];
  cargando: boolean;
  error: string | null;
}

const estadoInicial: UsuariosState = {
  lista: [],
  cargando: false,
  error: null,
};

// Reducer puro: (estado anterior, acción) => estado nuevo. Nunca muta
// `state` directamente, siempre devuelve un objeto nuevo.
export function usuariosReducer(
  state: UsuariosState = estadoInicial,
  action: UsuariosAction
): UsuariosState {
  switch (action.type) {
    case USUARIOS_CARGANDO:
      return { ...state, cargando: true, error: null };
    case USUARIOS_EXITO:
      return { ...state, cargando: false, lista: action.payload };
    case USUARIOS_ERROR:
      return { ...state, cargando: false, error: action.payload };
    default:
      return state;
  }
}
