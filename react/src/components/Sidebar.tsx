import type { DefinicionRuta } from '../routers/rutas';
import { Component } from 'react';
import type { ContextType } from 'react';
import { SesionContext } from '../context/SesionContext';

interface SidebarProps {
  rutas: DefinicionRuta[];
  rutaActiva: string;
  onNavegar: (id: string) => void;
}

class Sidebar extends Component<SidebarProps> {
  static contextType = SesionContext;
  declare context: ContextType<typeof SesionContext>;

  render() {
    const { rutas, rutaActiva, onNavegar } = this.props;
    const usuario = this.context.usuario;

    // Clasificación de rutas para cumplir con Actividad 3 (Dos Menús)
    const idsPrincipales = ['inicio', 'dashboard', 'home'];

    const paginasPrincipales = rutas.filter((r) =>
      idsPrincipales.includes(r.id.toLowerCase())
    );

    const tablasProyecto = rutas.filter(
      (r) => !idsPrincipales.includes(r.id.toLowerCase())
    );

    return (
      <aside className="sidebar">
        <div className="perfil-sidebar">
          <div className="avatar-usuario">🌾</div>
          <h4>{usuario ? usuario.nombre : 'Invitado'}</h4>
          <span className="badge-rol">{usuario?.rol ?? 'Sin sesión'}</span>
        </div>

        {/* MENÚ 1: Páginas Principales */}
        <div className="seccion-sidebar">
          <p className="titulo-seccion-sidebar" style={{ padding: '8px 15px', fontSize: '0.8em', color: '#888', fontWeight: 'bold' }}>
            PÁGINAS PRINCIPALES
          </p>
          <nav className="nav-sidebar">
            {paginasPrincipales.map((ruta) => (
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
        </div>

        {/* MENÚ 2: Tablas del Proyecto */}
        <div className="seccion-sidebar" style={{ marginTop: '15px' }}>
          <p className="titulo-seccion-sidebar" style={{ padding: '8px 15px', fontSize: '0.8em', color: '#888', fontWeight: 'bold' }}>
            TABLAS DEL PROYECTO
          </p>
          <nav className="nav-sidebar">
            {tablasProyecto.map((ruta) => (
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
        </div>
      </aside>
    );
  }
}

export default Sidebar;
