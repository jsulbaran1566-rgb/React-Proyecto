import { useState } from 'react';
import type { ChangeEvent } from 'react';
import CardAccion from './CardAccion';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'Productor' | 'Comprador' | 'Administrador';
}

const usuariosIniciales: Usuario[] = [
  { id: 1, nombre: 'Carlos Ramírez', correo: 'carlos@agrodirecto.com', rol: 'Productor' },
  { id: 2, nombre: 'Laura Gómez', correo: 'laura@agrodirecto.com', rol: 'Comprador' },
  { id: 3, nombre: 'Andrea Torres', correo: 'andrea@agrodirecto.com', rol: 'Administrador' },
];

type FiltroRol = 'Todos' | 'Productor' | 'Comprador' | 'Administrador';

function Usuarios() {
  // Estado local: lista de usuarios (se mantiene en estado por si se agregan más adelante)
  const [usuarios] = useState<Usuario[]>(usuariosIniciales);

  // Estado local: texto de búsqueda por nombre o correo
  const [busqueda, setBusqueda] = useState<string>('');

  // Estado local: filtro por rol seleccionado
  const [filtroRol, setFiltroRol] = useState<FiltroRol>('Todos');

  const manejarCambioBusqueda = (evento: ChangeEvent<HTMLInputElement>): void => {
    setBusqueda(evento.target.value);
  };

  const manejarCambioFiltroRol = (evento: ChangeEvent<HTMLSelectElement>): void => {
    setFiltroRol(evento.target.value as FiltroRol);
  };

  // Función que el padre (Usuarios) le pasa al hijo (CardAccion).
  // Cuando el hijo la invoca, el padre reacciona mostrando la acción y el módulo.
  const manejarAccionUsuarios = (mensaje: string): void => {
    alert(`Módulo: Usuarios\n${mensaje}`);
    console.log(`[Usuarios] ${mensaje}`);
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideBusqueda =
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideRol = filtroRol === 'Todos' || usuario.rol === filtroRol;
    return coincideBusqueda && coincideRol;
  });

  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Usuarios</h2>
      <p className="ad-panel__descripcion">
        Listado de usuarios registrados en la plataforma.
      </p>

      <div className="ad-filtros">
        <input
          type="text"
          className="ad-buscador"
          placeholder="Buscar por nombre o correo..."
          value={busqueda}
          onChange={manejarCambioBusqueda}
        />

        <select className="ad-selector" value={filtroRol} onChange={manejarCambioFiltroRol}>
          <option value="Todos">Todos los roles</option>
          <option value="Productor">Productor</option>
          <option value="Comprador">Comprador</option>
          <option value="Administrador">Administrador</option>
        </select>
      </div>

      <table className="ad-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((usuario) => (
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
          {usuariosFiltrados.length === 0 && (
            <tr>
              <td colSpan={3}>No se encontraron usuarios.</td>
            </tr>
          )}
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
