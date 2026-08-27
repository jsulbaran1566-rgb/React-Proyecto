import type { Dispatch } from 'redux';
import { obtenerLotes } from '../../api/lotesApi';
import { obtenerMensajeError } from '../../api/httpClient';
import { PRODUCTOS_CARGANDO, PRODUCTOS_EXITO, PRODUCTOS_ERROR } from './productosTypes';
import type { ProductosAction } from './productosTypes';

export function cargarProductos() {
  return async (dispatch: Dispatch<ProductosAction>) => {
    dispatch({ type: PRODUCTOS_CARGANDO });
    try {
      const lotes = await obtenerLotes();
      dispatch({ type: PRODUCTOS_EXITO, payload: lotes });
    } catch (error) {
      dispatch({ type: PRODUCTOS_ERROR, payload: obtenerMensajeError(error) });
    }
  };
}
