import { combineReducers } from 'redux';
import { usuariosReducer } from './usuarios/usuariosReducer';
import { productosReducer } from './productos/productosReducer';

// A medida que se migren más features (reservas, pagos, disputas...) a
// Redux, su reducer se agrega aquí. Cada key queda disponible en el store
// global como state.usuarios, state.productos, etc.
export const rootReducer = combineReducers({
  usuarios: usuariosReducer,
  productos: productosReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
