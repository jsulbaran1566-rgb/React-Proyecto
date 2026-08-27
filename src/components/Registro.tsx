import type { FormEvent } from 'react';
import CardAccion from './CardAccion';

// Sin useState: se lee el formulario con FormData al momento del envío
function manejarEnvioRegistro(evento: FormEvent<HTMLFormElement>) {
  evento.preventDefault();
  const datos = new FormData(evento.currentTarget);
  const nombre = datos.get('nombre');
  const correo = datos.get('correo');
  const contrasena = datos.get('contrasena');
  const rol = datos.get('rol');

  alert(
    `Registro enviado\nNombre: ${nombre}\nCorreo: ${correo}\nContraseña: ${contrasena}\nRol: ${rol}`
  );
  console.log('[Registro] Datos ingresados:', { nombre, correo, contrasena, rol });
}

// Función del padre (Registro) que el hijo (CardAccion) invoca
function manejarAccionRegistro(mensaje: string) {
  alert(`Módulo: Registro\n${mensaje}`);
  console.log(`[Registro] ${mensaje}`);
}

function Registro() {
  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Crear cuenta</h2>
      <p className="ad-panel__descripcion">
        Regístrate como productor o comprador en AgroDirecto.
      </p>

      <form className="ad-formulario" onSubmit={manejarEnvioRegistro}>
        <label className="ad-formulario__campo">
          Nombre completo
          <input type="text" name="nombre" placeholder="Nombre y apellido" required />
        </label>

        <label className="ad-formulario__campo">
          Correo
          <input type="email" name="correo" placeholder="usuario@correo.com" required />
        </label>

        <label className="ad-formulario__campo">
          Contraseña
          <input type="password" name="contrasena" placeholder="••••••••" required />
        </label>

        <label className="ad-formulario__campo">
          Rol
          <select name="rol" defaultValue="Productor">
            <option value="Productor">Productor</option>
            <option value="Comprador">Comprador</option>
          </select>
        </label>

        <button type="submit" className="ad-boton-primario">
          Registrarme
        </button>
      </form>

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
