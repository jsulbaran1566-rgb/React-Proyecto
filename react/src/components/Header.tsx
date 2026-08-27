import { Component } from 'react';
import type { ContextType } from 'react';
import { SesionContext } from '../context/SesionContext';

interface HeaderProps {
  titulo: string;
}

// Reproduce el nav superior del frontend estático (#nav-principal /
// .links-nav / .btn-verde.btn-salir en estilo.css): marca a la izquierda,
// rol + botón "Cerrar Sesión" a la derecha cuando hay sesión activa.
class Header extends Component<HeaderProps> {
  static contextType = SesionContext;
  declare context: ContextType<typeof SesionContext>;

  render() {
    const { titulo } = this.props;
    const { usuario, estaAutenticado, cerrarSesion } = this.context;

    return (
      <header className="ad-header" id="nav-principal">
        <div className="ad-header__marca">
          <span className="ad-header__logo">🌾</span>
          <h1 className="ad-header__titulo">{titulo}</h1>
        </div>

        <div className="links-nav">
          {estaAutenticado ? (
            <>
              <span className="texto-rol-nav">Sesión: {usuario?.nombre} ({usuario?.rol})</span>
              <button type="button" className="btn-verde btn-salir" onClick={cerrarSesion}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <p className="ad-header__eslogan">Del campo a tu mesa, directo</p>
          )}
        </div>
      </header>
    );
  }
}

export default Header;
