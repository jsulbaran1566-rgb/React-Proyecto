import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import CardAccion from './CardAccion';

type RolUsuario = 'Productor' | 'Comprador';

function Registro() {
  // Estado local tipado para cada entrada del formulario
  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [rol, setRol] = useState<RolUsuario>('Productor');
  const [aceptaTerminos, setAceptaTerminos] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);

  const manejarCambioNombre = (evento: ChangeEvent<HTMLInputElement>): void => {
    setNombre(evento.target.value);
  };

  const manejarCambioCorreo = (evento: ChangeEvent<HTMLInputElement>): void => {
    setCorreo(evento.target.value);
  };

  const manejarCambioContrasena = (evento: ChangeEvent<HTMLInputElement>): void => {
    setContrasena(evento.target.value);
  };

  const manejarCambioRol = (evento: ChangeEvent<HTMLSelectElement>): void => {
    setRol(evento.target.value as RolUsuario);
  };

  const alternarAceptaTerminos = (): void => {
    setAceptaTerminos((valorAnterior) => !valorAnterior);
  };

  const manejarEnvioRegistro = (evento: FormEvent<HTMLFormElement>): void => {
    evento.preventDefault();

    if (!aceptaTerminos) {
      alert('Debes aceptar los términos y condiciones para registrarte.');
      return;
    }

    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      alert(
        `Registro enviado\nNombre: ${nombre}\nCorreo: ${correo}\nRol: ${rol}`
      );
      console.log('[Registro] Datos ingresados:', { nombre, correo, contrasena, rol });
    }, 600);
  };

  // Función del padre (Registro) que el hijo (CardAccion) invoca
  const manejarAccionRegistro = (mensaje: string): void => {
    alert(`Módulo: Registro\n${mensaje}`);
    console.log(`[Registro] ${mensaje}`);
  };

  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Crear cuenta</h2>
      <p className="ad-panel__descripcion">
        Regístrate como productor o comprador en AgroDirecto.
      </p>

      <div className="ad-fila-formulario">
        <form className="ad-formulario" onSubmit={manejarEnvioRegistro}>
          <label className="ad-formulario__campo">
            Nombre completo
            <input
              type="text"
              name="nombre"
              placeholder="Nombre y apellido"
              value={nombre}
              onChange={manejarCambioNombre}
              required
            />
          </label>

          <label className="ad-formulario__campo">
            Correo
            <input
              type="email"
              name="correo"
              placeholder="usuario@correo.com"
              value={correo}
              onChange={manejarCambioCorreo}
              required
            />
          </label>

          <label className="ad-formulario__campo">
            Contraseña
            <input
              type="password"
              name="contrasena"
              placeholder="••••••••"
              value={contrasena}
              onChange={manejarCambioContrasena}
              required
            />
          </label>

          <label className="ad-formulario__campo">
            Rol
            <select name="rol" value={rol} onChange={manejarCambioRol}>
              <option value="Productor">Productor</option>
              <option value="Comprador">Comprador</option>
            </select>
          </label>

          <label className="ad-formulario__switch">
            <input type="checkbox" checked={aceptaTerminos} onChange={alternarAceptaTerminos} />
            Acepto los términos y condiciones
          </label>

          <button type="submit" className="ad-boton-primario" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        {/* Visualización en vivo de los datos que el usuario va ingresando */}
        <div className="ad-vista-previa">
          <h4 className="ad-vista-previa__titulo">Vista previa</h4>
          <p>
            <strong>Nombre:</strong> {nombre || '(sin ingresar)'}
          </p>
          <p>
            <strong>Correo:</strong> {correo || '(sin ingresar)'}
          </p>
          <p>
            <strong>Rol seleccionado:</strong> {rol}
          </p>
          <p>
            <strong>Términos aceptados:</strong> {aceptaTerminos ? 'Sí' : 'No'}
          </p>
        </div>
      </div>

      <div className="ad-cards-accion">
        <CardAccion
          titulo="Términos y condiciones"
          descripcion="Revisa las condiciones de uso antes de registrarte."
          textoBoton="Ver términos"
          onEjecutar={manejarAccionRegistro}
        />
      </div>
    </section>
  );
}

export default Registro;
