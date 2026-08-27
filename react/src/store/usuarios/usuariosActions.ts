import type { Dispatch } from 'redux';
import { obtenerUsuarios } from '../../api/usuariosApi';
import { obtenerMensajeError } from '../../api/httpClient';
import { USUARIOS_CARGANDO, USUARIOS_EXITO, USUARIOS_ERROR } from './usuariosTypes';
import type { UsuariosAction } from './usuariosTypes';

// Thunk: una función async que recibe `dispatch` y hace la llamada con
// Axios. Es la forma clásica (sin hooks) de manejar side-effects/async en
// Redux: el componente solo hace `dispatch(cargarUsuarios())` y el thunk se
// encarga de pedir los datos y guardarlos en el store.
export function cargarUsuarios() {
  return async (dispatch: Dispatch<UsuariosAction>) => {
    dispatch({ type: USUARIOS_CARGANDO });
    try {
      const usuarios = await obtenerUsuarios();
      dispatch({ type: USUARIOS_EXITO, payload: usuarios });
    } catch (error) {
      dispatch({ type: USUARIOS_ERROR, payload: obtenerMensajeError(error) });
    }
  };
}
