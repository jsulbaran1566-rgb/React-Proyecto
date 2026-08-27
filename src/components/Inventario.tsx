import CardAccion from './CardAccion';

interface ItemInventario {
  id: number;
  producto: string;
  cantidad: number;
  unidad: string;
  estado: 'Disponible' | 'Bajo' | 'Agotado';
}

// Datos estáticos: sin useState
const itemsInventario: ItemInventario[] = [
  { id: 1, producto: 'Aguacate Hass', cantidad: 320, unidad: 'kg', estado: 'Disponible' },
  { id: 2, producto: 'Papa Criolla', cantidad: 40, unidad: 'kg', estado: 'Bajo' },
  { id: 3, producto: 'Café Excelso', cantidad: 0, unidad: 'kg', estado: 'Agotado' },
];

// Función del padre (Inventario) que el hijo (CardAccion) invoca
function manejarAccionInventario(mensaje: string) {
  alert(`Módulo: Inventario\n${mensaje}`);
  console.log(`[Inventario] ${mensaje}`);
}

function Inventario() {
  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Inventario</h2>
      <p className="ad-panel__descripcion">
        Existencias actuales de productos en bodega.
      </p>

      <table className="ad-tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {itemsInventario.map((item) => (
            <tr key={item.id}>
              <td>{item.producto}</td>
              <td>{item.cantidad} {item.unidad}</td>
              <td>
                <span className={`ad-etiqueta ad-etiqueta--inv-${item.estado.toLowerCase()}`}>
                  {item.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
