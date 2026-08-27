import { Component } from 'react';
import type { FormEvent } from 'react';
import CardAccion from '../../components/CardAccion';
import { crearUsuario, obtenerUsuarios } from '../../api/usuariosApi';
import { obtenerTiposDocumento } from '../../api/tiposDocumentoApi';
import { obtenerRoles } from '../../api/rolesApi';
import type { TipoDocumento } from '../../api/tiposDocumentoApi';
import type { Rol } from '../../api/rolesApi';
import { obtenerMensajeError } from '../../api/httpClient';

interface RegistroState {
  tiposDocumento: TipoDocumento[];
  roles: Rol[];
  cargandoCatalogos: boolean;
  enviando: boolean;
  error: string | null;
}

// Sin hooks: componente de clase. Formulario no controlado (FormData). El
// backend NO autogenera el id de usuario (UsuarioCrear.id es obligatorio),
// así que se calcula como MAX(id existente) + 1 antes de enviar — misma
// limitación que el propio backend documenta en Utilidades/ids.py.
class Registro extends Component<Record<string, never>, RegistroState> {
  state: RegistroState = {
    tiposDocumento: [],
    roles: [],
    cargandoCatalogos: true,
    enviando: false,
    error: null,
  };

  componentDidMount() {
    Promise.all([obtenerTiposDocumento(), obtenerRoles()])
      .then(([tiposDocumento, roles]) => {
        // Solo se ofrece Productor/Comprador en el autorregistro público;
        // Administrador se asigna por otra vía (panel de Usuarios).
        const rolesPublicos = roles.filter((r) => r.nombre !== 'Administrador');
        this.setState({ tiposDocumento, roles: rolesPublicos, cargandoCatalogos: false });
      })
      .catch((error) =>
        this.setState({ error: obtenerMensajeError(error), cargandoCatalogos: false })
      );
  }

  manejarEnvioRegistro = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const nombre = String(datos.get('nombre') ?? '');
    const correo = String(datos.get('correo') ?? '');
    const telefono = String(datos.get('telefono') ?? '');
    const clave = String(datos.get('contrasena') ?? '');
    const tipoDocumento = String(datos.get('tipo_documento') ?? '');
    const numeroDocumento = String(datos.get('numero_documento') ?? '');
    const rolId = Number(datos.get('rol_id'));

    this.setState({ enviando: true, error: null });

    // El backend exige un id numérico único: se calcula a partir del
    // listado actual de usuarios (no hay endpoint que lo autogenere).
    obtenerUsuarios()
      .then((usuarios) => {
        const siguienteId = usuarios.reduce((max, u) => Math.max(max, u.id), 0) + 1;
        return crearUsuario({
          id: siguienteId,
          tipo_documento: tipoDocumento as never,
          numero_documento: numeroDocumento,
          nombre,
          correo,
          telefono,
          clave,
          rol_id: rolId,
        });
      })
      .then((usuario) => {
        alert(`Cuenta creada para ${usuario.nombre} (id ${usuario.id})`);
        console.log('[Registro] Usuario creado:', usuario);
        this.setState({ enviando: false });
        formulario.reset();
      })
      .catch((error) => {
        const mensaje = obtenerMensajeError(error);
        this.setState({ enviando: false, error: mensaje });
        alert(`No se pudo crear la cuenta: ${mensaje}`);
      });
  };

  manejarAccionRegistro = (mensaje: string) => {
    alert(`Módulo: Registro\n${mensaje}`);
    console.log(`[Registro] ${mensaje}`);
  };

  render() {
    const { tiposDocumento, roles, cargandoCatalogos, enviando, error } = this.state;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Crear cuenta</h2>
        <p className="ad-panel__descripcion">
          Regístrate como productor o comprador en AgroDirecto (POST /usuarios).
        </p>

        {error && <p className="ad-estado ad-estado--error">{error}</p>}
        {cargandoCatalogos && <p className="ad-estado ad-estado--cargando">Cargando formulario…</p>}

        {!cargandoCatalogos && (
          <form className="ad-formulario" onSubmit={this.manejarEnvioRegistro}>
            <label className="ad-formulario__campo">
              Nombre completo
              <input type="text" name="nombre" placeholder="Nombre y apellido" required />
            </label>

            <label className="ad-formulario__campo">
              Correo
              <input type="email" name="correo" placeholder="usuario@correo.com" required />
            </label>

            <label className="ad-formulario__campo">
              Teléfono
              <input type="tel" name="telefono" placeholder="3001234567" required />
            </label>

            <label className="ad-formulario__campo">
              Tipo de documento
              <select name="tipo_documento" defaultValue={tiposDocumento[0]?.codigo ?? ''} required>
                {tiposDocumento.map((tipo) => (
                  <option key={tipo.codigo} value={tipo.codigo}>
                    {tipo.nombre} ({tipo.codigo})
                  </option>
                ))}
              </select>
            </label>

            <label className="ad-formulario__campo">
              Número de documento
              <input type="text" name="numero_documento" placeholder="1094xxxxxx" required />
            </label>

            <label className="ad-formulario__campo">
              Contraseña
              <input type="password" name="contrasena" placeholder="••••••••" minLength={6} required />
            </label>

            <label className="ad-formulario__campo">
              Rol
              <select name="rol_id" defaultValue={roles[0]?.id ?? ''} required>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" className="ad-boton-primario" disabled={enviando}>
              {enviando ? 'Registrando…' : 'Registrarme'}
            </button>
          </form>
        )}

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Términos y condiciones"
            descripcion="Revisa las condiciones de uso antes de registrarte."
            textoBoton="Ver términos"
            onEjecutar={this.manejarAccionRegistro}
          />
        </div>
      </section>
    );
  }
}

export default Registro;
