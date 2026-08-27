import type { Lote } from '../../api/lotesApi';
import { PRODUCTOS_CARGANDO, PRODUCTOS_EXITO, PRODUCTOS_ERROR } from './productosTypes';
import type { ProductosAction } from './productosTypes';

export interface ProductosState {
  lista: Lote[];
  cargando: boolean;
  error: string | null;
}

const estadoInicial: ProductosState = {
  lista: [],
  cargando: false,
  error: null,
};

export function productosReducer(
  state: ProductosState = estadoInicial,
  action: ProductosAction
): ProductosState {
  switch (action.type) {
    case PRODUCTOS_CARGANDO:
      return { ...state, cargando: true, error: null };
    case PRODUCTOS_EXITO:
      return { ...state, cargando: false, lista: action.payload };
    case PRODUCTOS_ERROR:
      return { ...state, cargando: false, error: action.payload };
    default:
      return state;
  }
}
