import CardAccion from './CardAccion';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'Productor' | 'Comprador' | 'Administrador';
}

// Datos estáticos: sin useState, ya que no cambian dentro del componente
const usuarios: Usuario[] = [
  { id: 1, nombre: 'Carlos Ramírez', correo: 'carlos@agrodirecto.com', rol: 'Productor' },
  { id: 2, nombre: 'Laura Gómez', correo: 'laura@agrodirecto.com', rol: 'Comprador' },
  { id: 3, nombre: 'Andrea Torres', correo: 'andrea@agrodirecto.com', rol: 'Administrador' },
];

// Función que el padre (Usuarios) le pasa al hijo (CardAccion).
// Cuando el hijo la invoca, el padre reacciona mostrando la acción y el módulo.
function manejarAccionUsuarios(mensaje: string) {
  alert(`Módulo: Usuarios\n${mensaje}`);
  console.log(`[Usuarios] ${mensaje}`);
}

function Usuarios() {
  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Usuarios</h2>
      <p className="ad-panel__descripcion">
        Listado de usuarios registrados en la plataforma.
      </p>

      <table className="ad-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>
                <span className={`ad-etiqueta ad-etiqueta--${usuario.rol.toLowerCase()}`}>
                  {usuario.rol}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Padre -> Hijo: se envían título, descripción y texto por props */}
      <div className="ad-cards-accion">
        <CardAccion
          titulo="Nuevo usuario"
          descripcion="Registrar un nuevo usuario en la plataforma."
          textoBoton="Agregar"
          onEjecutar={manejarAccionUsuarios}
        />
        <CardAccion
          titulo="Exportar listado"
          descripcion="Descargar el listado de usuarios en formato CSV."
          textoBoton="Exportar"
          onEjecutar={manejarAccionUsuarios}
        />
      </div>
    </section>
  );
}

export default Usuarios;
