import type { ComponentType } from 'react';
import Usuarios from '../features/usuarios/Usuarios';
import Productos from '../features/productos/Productos';
import Login from '../features/auth/Login';
import Registro from '../features/auth/Registro';
import Inventario from '../features/inventario/Inventario';
import Reservas from '../features/reservas/Reservas';
import Entregas from '../features/entregas/Entregas';
import Pagos from '../features/pagos/Pagos';
import Disputas from '../features/disputas/Disputas';
import Favoritos from '../features/favoritos/Favoritos';
import Notificaciones from '../features/notificaciones/Notificaciones';
import Roles from '../features/roles/Roles';
import Configuracion from '../features/configuracion/Configuracion';
import Reportes from '../features/reportes/Reportes';

// Fuente única de verdad para la navegación: el Sidebar dibuja los botones
// a partir de esta lista y el AppRouter decide qué feature renderizar según
// la ruta activa. Así se evita repetir el listado de páginas en dos lugares.
export interface DefinicionRuta {
  id: string;
  etiqueta: string;
  icono: string;
  Componente: ComponentType;
}

export const RUTA_INICIAL = 'usuarios';

export const rutas: DefinicionRuta[] = [
  { id: 'usuarios', etiqueta: 'Usuarios', icono: '👤', Componente: Usuarios },
  { id: 'productos', etiqueta: 'Productos', icono: '🌽', Componente: Productos },
  { id: 'login', etiqueta: 'Login', icono: '🔐', Componente: Login },
  { id: 'registro', etiqueta: 'Registro', icono: '📝', Componente: Registro },
  { id: 'inventario', etiqueta: 'Inventario', icono: '📦', Componente: Inventario },
  { id: 'reservas', etiqueta: 'Reservas', icono: '📅', Componente: Reservas },
  { id: 'entregas', etiqueta: 'Entregas', icono: '🚚', Componente: Entregas },
  { id: 'pagos', etiqueta: 'Pagos', icono: '💳', Componente: Pagos },
  { id: 'disputas', etiqueta: 'Disputas', icono: '⚖️', Componente: Disputas },
  { id: 'favoritos', etiqueta: 'Favoritos', icono: '⭐', Componente: Favoritos },
  { id: 'notificaciones', etiqueta: 'Notificaciones', icono: '🔔', Componente: Notificaciones },
  { id: 'roles', etiqueta: 'Roles', icono: '🛡️', Componente: Roles },
  { id: 'configuracion', etiqueta: 'Configuración', icono: '⚙️', Componente: Configuracion },
  { id: 'reportes', etiqueta: 'Reportes', icono: '📊', Componente: Reportes },
];

export function obtenerRutaPorId(id: string): DefinicionRuta {
  return rutas.find((r) => r.id === id) ?? rutas[0];
}
