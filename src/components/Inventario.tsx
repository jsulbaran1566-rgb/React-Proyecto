import { useState } from 'react';
import type { ChangeEvent } from 'react';
import CardAccion from './CardAccion';

interface ItemInventario {
  id: number;
  producto: string;
  cantidad: number;
  unidad: string;
  estado: 'Disponible' | 'Bajo' | 'Agotado';
}

const itemsIniciales: ItemInventario[] = [
  {
    id: 1,
    producto: 'Aguacate Hass',
    cantidad: 320,
    unidad: 'kg',
    estado: 'Disponible',
  },
  {
    id: 2,
    producto: 'Papa Criolla',
    cantidad: 40,
    unidad: 'kg',
    estado: 'Bajo',
  },
  {
    id: 3,
    producto: 'Café Excelso',
    cantidad: 0,
    unidad: 'kg',
    estado: 'Agotado',
  },
];

type FiltroEstado = 'Todos' | 'Disponible' | 'Bajo' | 'Agotado';

function Inventario() {
  // Estado local: lista de productos del inventario
  const [itemsInventario, setItemsInventario] =
    useState<ItemInventario[]>(itemsIniciales);

  // Estado local: texto de búsqueda por nombre del producto
  const [busqueda, setBusqueda] = useState<string>('');

  // Estado local: filtro por estado del inventario
  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstado>('Todos');

  // Estado local: contador de reabastecimientos
  const [contadorReabastecimientos, setContadorReabastecimientos] =
    useState<number>(0);

  // Maneja el buscador
  const manejarCambioBusqueda = (
    evento: ChangeEvent<HTMLInputElement>
  ): void => {
    setBusqueda(evento.target.value);
  };

  // Maneja el filtro de estado
  const manejarCambioFiltroEstado = (
    evento: ChangeEvent<HTMLSelectElement>
  ): void => {
    setFiltroEstado(evento.target.value as FiltroEstado);
  };

  // Función que recibe las acciones del componente CardAccion
  const manejarAccionInventario = (mensaje: string): void => {
    if (mensaje.includes('Reabastecer')) {
      // Reabastece los productos que están Bajos o Agotados
      setItemsInventario((listaAnterior) =>
        listaAnterior.map((item) =>
          item.estado !== 'Disponible'
            ? {
                ...item,
                cantidad: item.cantidad + 100,
                estado: 'Disponible',
              }
            : item
        )
      );

      setContadorReabastecimientos(
        (valorAnterior) => valorAnterior + 1
      );
    }

    alert(`Módulo: Inventario\n${mensaje}`);
    console.log(`[Inventario] ${mensaje}`);
  };

  // Filtra los productos por nombre y estado
  const itemsVisibles = itemsInventario.filter((item) => {
    const coincideBusqueda = item.producto
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === 'Todos' ||
      item.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Inventario</h2>

      <p className="ad-panel__descripcion">
        Existencias actuales de productos en bodega.
      </p>

      {/* Buscador y filtro */}
      <div className="ad-filtros">
        <input
          type="text"
          className="ad-buscador"
          placeholder="Buscar por producto..."
          value={busqueda}
          onChange={manejarCambioBusqueda}
        />

        <select
          className="ad-selector"
          value={filtroEstado}
          onChange={manejarCambioFiltroEstado}
        >
          <option value="Todos">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Bajo">Bajo</option>
          <option value="Agotado">Agotado</option>
        </select>
      </div>

      {/* Tabla del inventario */}
      <table className="ad-tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {itemsVisibles.map((item) => (
            <tr key={item.id}>
              <td>{item.producto}</td>

              <td>
                {item.cantidad} {item.unidad}
              </td>

              <td>
                <span
                  className={`ad-etiqueta ad-etiqueta--inv-${item.estado.toLowerCase()}`}
                >
                  {item.estado}
                </span>
              </td>
            </tr>
          ))}

          {itemsVisibles.length === 0 && (
            <tr>
              <td colSpan={3}>
                No se encontraron productos.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Información de reabastecimientos */}
      {contadorReabastecimientos > 0 && (
        <div className="ad-vista-previa">
          <p>
            <strong>Reabastecimientos realizados:</strong>{' '}
            {contadorReabastecimientos}
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="ad-cards-accion">
        <CardAccion
          titulo="Reabastecer stock"
          descripcion="Generar una orden de reabastecimiento para los productos bajos o agotados."
          textoBoton="Reabastecer"
          onEjecutar={manejarAccionInventario}
        />

        <CardAccion
          titulo="Generar reporte"
          descripcion="Exportar el estado actual del inventario en PDF."
          textoBoton="Generar"
          onEjecutar={manejarAccionInventario}
        />
      </div>
    </section>
  );
}

export default Inventario;