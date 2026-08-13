import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import CardAccion from './CardAccion';

function Login() {
  // Estado local tipado para cada entrada del formulario
  const [usuario, setUsuario] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [mostrarContrasena, setMostrarContrasena] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);
  const [envioExitoso, setEnvioExitoso] = useState<boolean>(false);

  const manejarCambioUsuario = (evento: ChangeEvent<HTMLInputElement>): void => {
    setUsuario(evento.target.value);
    setEnvioExitoso(false);
  };

  const manejarCambioContrasena = (evento: ChangeEvent<HTMLInputElement>): void => {
    setContrasena(evento.target.value);
    setEnvioExitoso(false);
  };

  const alternarVisibilidadContrasena = (): void => {
    setMostrarContrasena((valorAnterior) => !valorAnterior);
  };

  const manejarEnvioLogin = (evento: FormEvent<HTMLFormElement>): void => {
    evento.preventDefault();
    setCargando(true);

    // Simula una llamada al backend antes de confirmar el login
    setTimeout(() => {
      setCargando(false);
      setEnvioExitoso(true);
      console.log('[Login] Datos ingresados:', { usuario, contrasena });
    }, 600);
  };

  // Función del padre (Login) que el hijo (CardAccion) invoca
  const manejarAccionLogin = (mensaje: string): void => {
    alert(`Módulo: Login\n${mensaje}`);
    console.log(`[Login] ${mensaje}`);
  };

  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Iniciar sesión</h2>
      <p className="ad-panel__descripcion">
        Ingresa tus credenciales para acceder a la plataforma.
      </p>

      <div className="ad-fila-formulario">
        <form className="ad-formulario" onSubmit={manejarEnvioLogin}>
          <label className="ad-formulario__campo">
            Usuario
            <input
              type="text"
              name="usuario"
              placeholder="usuario@correo.com"
              value={usuario}
              onChange={manejarCambioUsuario}
              required
            />
          </label>

          <label className="ad-formulario__campo">
            Contraseña
            <input
              type={mostrarContrasena ? 'text' : 'password'}
              name="contrasena"
              placeholder="••••••••"
              value={contrasena}
              onChange={manejarCambioContrasena}
              required
            />
          </label>

          <label className="ad-formulario__switch">
            <input
              type="checkbox"
              checked={mostrarContrasena}
              onChange={alternarVisibilidadContrasena}
            />
            Mostrar contraseña
          </label>

          <button type="submit" className="ad-boton-primario" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Visualización en vivo de los datos que el usuario va ingresando */}
        <div className="ad-vista-previa">
          <h4 className="ad-vista-previa__titulo">Vista previa</h4>
          <p>
            <strong>Usuario:</strong> {usuario || '(sin ingresar)'}
          </p>
          <p>
            <strong>Contraseña:</strong>{' '}
            {contrasena ? '•'.repeat(contrasena.length) : '(sin ingresar)'}
          </p>
          {envioExitoso && (
            <p className="ad-vista-previa__exito">✅ Formulario enviado correctamente</p>
          )}
        </div>
      </div>

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
