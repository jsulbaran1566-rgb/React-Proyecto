import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { rootReducer } from './rootReducer';
import type { RootState } from './rootReducer';

// Store global: aquí vive toda la información traída de la API que debe
// estar disponible en cualquier parte de la aplicación (no solo en el
// componente que originalmente hizo el fetch). `thunk` permite que los
// action creators sean funciones async (ver usuariosActions.ts /
// productosActions.ts) para poder llamar a Axios antes de despachar.
export const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppDispatch = typeof store.dispatch;
export type { RootState };
