import type { Lote } from '../../api/lotesApi';

export const PRODUCTOS_CARGANDO = 'productos/cargando';
export const PRODUCTOS_EXITO = 'productos/exito';
export const PRODUCTOS_ERROR = 'productos/error';

interface ProductosCargandoAction {
  type: typeof PRODUCTOS_CARGANDO;
}

interface ProductosExitoAction {
  type: typeof PRODUCTOS_EXITO;
  payload: Lote[];
}

interface ProductosErrorAction {
  type: typeof PRODUCTOS_ERROR;
  payload: string;
}

export type ProductosAction = ProductosCargandoAction | ProductosExitoAction | ProductosErrorAction;
