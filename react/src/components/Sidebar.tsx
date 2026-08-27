import type { DefinicionRuta } from '../routers/rutas';
import { Component } from 'react';
import type { ContextType } from 'react';
import { SesionContext } from '../context/SesionContext';

interface SidebarProps {
  rutas: DefinicionRuta[];
  rutaActiva: string;
  onNavegar: (id: string) => void;
}

// Consume el contexto de sesión sin hooks: static contextType (permitido,
// no es useContext) para mostrar el nombre/rol del usuario logueado, igual
// que el bloque ".perfil-sidebar" del frontend estático (panel_productor.html,
// panel_admin.html, panel_comprador.html).
class Sidebar extends Component<SidebarProps> {
  static contextType = SesionContext;
  declare context: ContextType<typeof SesionContext>;

  render() {
    const { rutas, rutaActiva, onNavegar } = this.props;
    const usuario = this.context.usuario;

    return (
      // Clases tomadas del frontend estático (estilo.css: .sidebar,
      // .perfil-sidebar, .nav-sidebar, .activo) para que los botones se
      // vean igual que en las páginas panel_*.html.
      <aside className="sidebar">
        <div className="perfil-sidebar">
          <div className="avatar-usuario">🌾</div>
          <h4>{usuario ? usuario.nombre : 'Invitado'}</h4>
          <span className="badge-rol">{usuario?.rol ?? 'Sin sesión'}</span>
        </div>

        <nav className="nav-sidebar">
          {rutas.map((ruta) => (
            <a
              key={ruta.id}
              href={`#/${ruta.id}`}
              className={rutaActiva === ruta.id ? 'activo' : ''}
              onClick={(evento) => {
                evento.preventDefault();
                onNavegar(ruta.id);
              }}
            >
              {ruta.icono} {ruta.etiqueta}
            </a>
          ))}
        </nav>
      </aside>
    );
  }
}

export default Sidebar;
