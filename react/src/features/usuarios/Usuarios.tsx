import { Component } from 'react';
import { connect } from 'react-redux';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import type { RootState, AppDispatch } from '../../store/store';
import { cargarUsuarios } from '../../store/usuarios/usuariosActions';
import type { Usuario } from '../../api/usuariosApi';

// Props que vienen del store global (mapStateToProps)
interface UsuariosPropsDelState {
  usuarios: Usuario[];
  cargando: boolean;
  error: string | null;
}

// Props que despachan acciones al store (mapDispatchToProps)
interface UsuariosPropsDelDispatch {
  cargarUsuarios: () => void;
}

type UsuariosProps = UsuariosPropsDelState & UsuariosPropsDelDispatch;

// Sin hooks: en vez de useSelector/useDispatch se usa el HOC connect()
// (al final del archivo), que conecta este componente de CLASE al store
// de Redux inyectándole las props de arriba. El propio componente no
// guarda ya `usuarios` en this.state: vive en el store global y queda
// disponible para cualquier otra parte de la app.
class Usuarios extends Component<UsuariosProps> {
  componentDidMount() {
    this.props.cargarUsuarios();
  }

  manejarAccionUsuarios = (mensaje: string) => {
    alert(`Módulo: Usuarios\n${mensaje}`);
    console.log(`[Usuarios] ${mensaje}`);
  };

  render() {
    const { usuarios, cargando, error, cargarUsuarios: recargar } = this.props;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Usuarios</h2>
        <p className="ad-panel__descripcion">
          Listado de usuarios registrados en la plataforma (GET /usuarios), desde Redux.
        </p>

        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

        {!cargando && !error && (
          <table className="ad-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>
                    <span
                      className={`ad-etiqueta ad-etiqueta--${(usuario.rol ?? '').toLowerCase()}`}
                    >
                      {usuario.rol ?? 'Sin rol'}
                    </span>
                  </td>
                  <td>{usuario.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Nuevo usuario"
            descripcion="Registrar un nuevo usuario en la plataforma."
            textoBoton="Agregar"
            onEjecutar={this.manejarAccionUsuarios}
          />
          <CardAccion
            titulo="Exportar listado"
            descripcion="Descargar el listado de usuarios en formato CSV."
            textoBoton="Exportar"
            onEjecutar={this.manejarAccionUsuarios}
          />
        </div>
      </section>
    );
  }
}

function mapStateToProps(state: RootState): UsuariosPropsDelState {
  return {
    usuarios: state.usuarios.lista,
    cargando: state.usuarios.cargando,
    error: state.usuarios.error,
  };
}

function mapDispatchToProps(dispatch: AppDispatch): UsuariosPropsDelDispatch {
  return {
    cargarUsuarios: () => dispatch(cargarUsuarios()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Usuarios);
