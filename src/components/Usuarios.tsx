import { useState } from 'react';

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

function Usuarios() {
  const [usuarios] = useState<Usuario[]>(usuariosIniciales);

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
    </section>
  );
}

export default Usuarios;
