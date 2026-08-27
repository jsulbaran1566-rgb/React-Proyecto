import { Component } from 'react';
import type { FormEvent, ContextType } from 'react';
import CardAccion from '../../components/CardAccion';
import { login } from '../../api/authApi';
import { CLAVE_TOKEN, obtenerMensajeError } from '../../api/httpClient';
import { SesionContext } from '../../context/SesionContext';

interface LoginState {
  enviando: boolean;
  error: string | null;
}

// Sin hooks: componente de clase. El formulario sigue siendo "no
// controlado" (se lee con FormData), pero ahora el envío llama de verdad
// a POST /auth/login con Axios y guarda el JWT en sessionStorage.
class Login extends Component<Record<string, never>, LoginState> {
  static contextType = SesionContext;
  declare context: ContextType<typeof SesionContext>;

  state: LoginState = {
    enviando: false,
    error: null,
  };

  manejarEnvioLogin = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const correo = String(datos.get('usuario') ?? '');
    const clave = String(datos.get('contrasena') ?? '');

    this.setState({ enviando: true, error: null });

    login(correo, clave)
      .then(({ token, usuario }) => {
        sessionStorage.setItem(CLAVE_TOKEN, token);
        // El SesionContext guarda el usuario en sessionStorage y avisa a
        // Header/Sidebar (vía Context, sin hooks) para que muestren el
        // nombre, el rol y el botón "Cerrar Sesión" de una vez.
        this.context.iniciarSesion(usuario);
        alert(`Bienvenido, ${usuario.nombre} (${usuario.rol})`);
        console.log('[Login] Sesión iniciada:', usuario);
        this.setState({ enviando: false });
      })
      .catch((error) => {
        const mensaje = obtenerMensajeError(error);
        this.setState({ enviando: false, error: mensaje });
        alert(`No se pudo iniciar sesión: ${mensaje}`);
      });
  };

  manejarAccionLogin = (mensaje: string) => {
    alert(`Módulo: Login\n${mensaje}`);
    console.log(`[Login] ${mensaje}`);
  };

  render() {
    const { enviando, error } = this.state;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Iniciar sesión</h2>
        <p className="ad-panel__descripcion">
          Ingresa tus credenciales para acceder a la plataforma (POST /auth/login).
        </p>

        {error && <p className="ad-estado ad-estado--error">{error}</p>}

        <form className="ad-formulario" onSubmit={this.manejarEnvioLogin}>
          <label className="ad-formulario__campo">
            Correo
            <input type="email" name="usuario" placeholder="usuario@correo.com" required />
          </label>

          <label className="ad-formulario__campo">
            Contraseña
            <input type="password" name="contrasena" placeholder="••••••••" required />
          </label>

          <button type="submit" className="ad-boton-primario" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <div className="ad-cards-accion">
          <CardAccion
            titulo="¿Olvidaste tu contraseña?"
            descripcion="Solicita un enlace de recuperación a tu correo registrado."
            textoBoton="Recuperar"
            onEjecutar={this.manejarAccionLogin}
          />
        </div>
      </section>
    );
  }
}

export default Login;
