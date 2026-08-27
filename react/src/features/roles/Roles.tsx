import { Component } from 'react';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerRoles } from '../../api/rolesApi';
import type { Rol } from '../../api/rolesApi';
import { obtenerMensajeError } from '../../api/httpClient';

interface RolesState {
  roles: Rol[];
  cargando: boolean;
  error: string | null;
}

// Sin hooks: componente de clase. Trae roles reales (GET /roles).
class Roles extends Component<Record<string, never>, RolesState> {
  state: RolesState = {
    roles: [],
    cargando: true,
    error: null,
  };

  componentDidMount() {
    this.cargarRoles();
  }

  cargarRoles = () => {
    this.setState({ cargando: true, error: null });
    obtenerRoles()
      .then((roles) => this.setState({ roles, cargando: false }))
      .catch((error) => this.setState({ error: obtenerMensajeError(error), cargando: false }));
  };

  manejarAccionRoles = (mensaje: string) => {
    alert(`Módulo: Roles\n${mensaje}`);
    console.log(`[Roles] ${mensaje}`);
  };

  render() {
    const { roles, cargando, error } = this.state;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Roles</h2>
        <p className="ad-panel__descripcion">
          Roles disponibles en la plataforma y su alcance de permisos (GET /roles).
        </p>

        <EstadoCarga cargando={cargando} error={error} onReintentar={this.cargarRoles} />

        {!cargando && !error && (
          <table className="ad-tabla">
            <thead>
              <tr>
                <th>Rol</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((rol) => (
                <tr key={rol.id}>
                  <td>
                    <span className={`ad-etiqueta ad-etiqueta--${rol.nombre.toLowerCase()}`}>
                      {rol.nombre}
                    </span>
                  </td>
                  <td>{rol.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Nuevo rol"
            descripcion="Definir un nuevo rol personalizado para la plataforma."
            textoBoton="Crear"
            onEjecutar={this.manejarAccionRoles}
          />
        </div>
      </section>
    );
  }
}

export default Roles;
