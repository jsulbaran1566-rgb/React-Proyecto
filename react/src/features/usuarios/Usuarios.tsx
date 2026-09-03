import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import type { RootState, AppDispatch } from '../../store/store';
import { cargarUsuarios } from '../../store/usuarios/usuariosActions';

export default function Usuarios() {
  const dispatch = useDispatch<AppDispatch>();

  // Obtener datos desde el store global de Redux
  const { lista: usuarios, cargando, error } = useSelector(
    (state: RootState) => state.usuarios
  );

  // Cargar usuarios al montar el componente
  useEffect(() => {
    dispatch(cargarUsuarios());
  }, [dispatch]);

  const manejarAccionUsuarios = (mensaje: string) => {
    alert(`Módulo: Usuarios\n${mensaje}`);
    console.log(`[Usuarios] ${mensaje}`);
  };

  const reintentarCarga = () => {
    dispatch(cargarUsuarios());
  };

  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Usuarios</h2>
      <p className="ad-panel__descripcion">
        Listado de usuarios registrados en la plataforma AgroDirecto.
      </p>

      {/* Manejo de estados de carga y error */}
      <EstadoCarga cargando={cargando} error={error} onReintentar={reintentarCarga} />

      {!cargando && !error && (
        <table className="ad-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>
                  <span
                    className={`ad-etiqueta ad-etiqueta--${(usuario.rol ?? '').toLowerCase()}`}
                  >
                    {usuario.rol ?? 'Sin rol'}
                  </span>
                </td>
                <td>{usuario.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
