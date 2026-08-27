import { Component, createContext } from 'react';
import type { ReactNode } from 'react';
import { CLAVE_USUARIO, CLAVE_TOKEN } from '../api/httpClient';
import type { UsuarioSesion } from '../api/authApi';

// Igual que en el frontend estático (sessionStorage "token" / "usuario_rol"),
// la sesión vive en sessionStorage; este Context sólo la expone al árbol de
// componentes para no tener que leer sessionStorage en cada feature.
//
// La actividad prohíbe hooks, así que el Provider es un componente de CLASE
// (this.state) y los componentes hijos consumen el contexto con
// `static contextType = SesionContext` (o <SesionContext.Consumer>), NUNCA
// con el hook useContext.
export interface SesionContextValor {
  usuario: UsuarioSesion | null;
  estaAutenticado: boolean;
  iniciarSesion: (usuario: UsuarioSesion) => void;
  cerrarSesion: () => void;
}

const valorPorDefecto: SesionContextValor = {
  usuario: null,
  estaAutenticado: false,
  iniciarSesion: () => {},
  cerrarSesion: () => {},
};

export const SesionContext = createContext<SesionContextValor>(valorPorDefecto);

interface SesionProviderProps {
  children: ReactNode;
}

interface SesionProviderState {
  usuario: UsuarioSesion | null;
}

function leerUsuarioGuardado(): UsuarioSesion | null {
  try {
    const crudo = sessionStorage.getItem(CLAVE_USUARIO);
    return crudo ? (JSON.parse(crudo) as UsuarioSesion) : null;
  } catch {
    return null;
  }
}

export class SesionProvider extends Component<SesionProviderProps, SesionProviderState> {
  state: SesionProviderState = {
    usuario: leerUsuarioGuardado(),
  };

  iniciarSesion = (usuario: UsuarioSesion) => {
    sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    this.setState({ usuario });
  };

  cerrarSesion = () => {
    sessionStorage.removeItem(CLAVE_TOKEN);
    sessionStorage.removeItem(CLAVE_USUARIO);
    this.setState({ usuario: null });
  };

  render() {
    const valor: SesionContextValor = {
      usuario: this.state.usuario,
      estaAutenticado: this.state.usuario !== null,
      iniciarSesion: this.iniciarSesion,
      cerrarSesion: this.cerrarSesion,
    };

    return <SesionContext.Provider value={valor}>{this.props.children}</SesionContext.Provider>;
  }
}

export default SesionContext;
