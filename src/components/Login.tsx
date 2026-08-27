import type { FormEvent } from 'react';
import CardAccion from './CardAccion';

// Sin useState: el formulario es "no controlado", los valores se leen
// directamente del formulario en el momento del envío con FormData.
function manejarEnvioLogin(evento: FormEvent<HTMLFormElement>) {
  evento.preventDefault();
  const datos = new FormData(evento.currentTarget);
  const usuario = datos.get('usuario');
  const contrasena = datos.get('contrasena');

  alert(`Login enviado\nUsuario: ${usuario}\nContraseña: ${contrasena}`);
  console.log('[Login] Datos ingresados:', { usuario, contrasena });
}

// Función del padre (Login) que el hijo (CardAccion) invoca
function manejarAccionLogin(mensaje: string) {
  alert(`Módulo: Login\n${mensaje}`);
  console.log(`[Login] ${mensaje}`);
}

function Login() {
  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Iniciar sesión</h2>
      <p className="ad-panel__descripcion">
        Ingresa tus credenciales para acceder a la plataforma.
      </p>

      <form className="ad-formulario" onSubmit={manejarEnvioLogin}>
        <label className="ad-formulario__campo">
          Usuario
          <input type="text" name="usuario" placeholder="usuario@correo.com" required />
        </label>

        <label className="ad-formulario__campo">
          Contraseña
          <input type="password" name="contrasena" placeholder="••••••••" required />
        </label>

        <button type="submit" className="ad-boton-primario">
          Ingresar
        </button>
      </form>

      <div className="ad-cards-accion">
        <CardAccion
          titulo="¿Olvidaste tu contraseña?"
          descripcion="Solicita un enlace de recuperación a tu correo registrado."
          textoBoton="Recuperar"
          onEjecutar={manejarAccionLogin}
        />
      </div>
    </section>
  );
}

export default Login;
