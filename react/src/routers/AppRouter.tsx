import { Component } from 'react';
import Sidebar from '../components/Sidebar';
import { rutas, obtenerRutaPorId, RUTA_INICIAL } from './rutas';

// Router propio, basado en el hash de la URL (#/usuarios, #/productos, ...).
// La actividad prohíbe hooks, así que no se usa react-router-dom (su API
// moderna depende de hooks como useNavigate); en su lugar este componente
// de CLASE escucha el evento nativo "hashchange" y guarda la ruta activa en
// this.state, igual que hacía App.tsx antes con "pagina".
//
// Ventaja frente al switch manual que tenía App.tsx: cada página tiene una
// URL real (recargable y con botón "atrás" del navegador), tal como en el
// frontend estático original (cada .html era una URL distinta).
function leerRutaDesdeHash(): string {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return hash || RUTA_INICIAL;
}

interface AppRouterState {
  rutaActiva: string;
}

class AppRouter extends Component<Record<string, never>, AppRouterState> {
  state: AppRouterState = {
    rutaActiva: leerRutaDesdeHash(),
  };

  componentDidMount() {
    window.addEventListener('hashchange', this.manejarCambioDeHash);
    if (!window.location.hash) {
      window.location.hash = `/${RUTA_INICIAL}`;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.manejarCambioDeHash);
  }

  manejarCambioDeHash = () => {
    this.setState({ rutaActiva: leerRutaDesdeHash() });
  };

  // Se pasa al Sidebar (Padre -> Hijo); el Sidebar lo invoca al hacer clic
  // en un botón (Hijo -> Padre) y esto actualiza la URL.
  navegarA = (id: string) => {
    window.location.hash = `/${id}`;
  };

  render() {
    const { rutaActiva } = this.state;
    const { Componente } = obtenerRutaPorId(rutaActiva);

    return (
      <div className="ad-app__cuerpo">
        <Sidebar rutas={rutas} rutaActiva={rutaActiva} onNavegar={this.navegarA} />

        <main className="ad-app__contenido">
          <Componente />
        </main>
      </div>
    );
  }
}

export default AppRouter;
