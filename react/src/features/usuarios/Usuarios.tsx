TypeScript
import { useState } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  estado: string;
}

export const Usuarios = () => {
  const [usuarios] = useState<Usuario[]>([
    { id: 1, nombre: 'Juan Pérez', correo: 'juan@agro.com', rol: 'Productor', estado: 'Activo' },
    { id: 2, nombre: 'María Gómez', correo: 'maria@agro.com', rol: 'Comprador', estado: 'Activo' },
    { id: 3, nombre: 'Carlos López', correo: 'carlos@agro.com', rol: 'Administrador', estado: 'Inactivo' },
  ]);

  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Detalle de Registros: Tabla Usuarios</h2>
      <p className="ad-panel__descripcion">Listado completo de usuarios registrados en la plataforma.</p>

      <table className="ad-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo Electrónico</th>
            <th>Rol</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>
                <span className={ad-etiqueta ${u.estado === 'Activo' ? 'ad-etiqueta--activo' : 'ad-etiqueta--inactivo'}}>
                  {u.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Usuarios;
