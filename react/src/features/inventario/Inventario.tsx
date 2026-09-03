import { useState } from 'react';

interface LoteInventario {
  id: number;
  producto: string;
  categoria: string;
  disponibleKg: number;
  estado: 'Disponible' | 'Bajo Stock' | 'Agotado';
}

export const Inventario = () => {
  const [inventario] = useState<LoteInventario[]>([
    { id: 101, producto: 'Papa Sabanera', categoria: 'Tubérculos', disponibleKg: 450, estado: 'Disponible' },
    { id: 102, producto: 'Zanahoria', categoria: 'Hortalizas', disponibleKg: 30, estado: 'Bajo Stock' },
    { id: 103, producto: 'Cebolla Larga', categoria: 'Hortalizas', disponibleKg: 0, estado: 'Agotado' },
  ]);

  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Detalle de Registros: Tabla Inventario</h2>
      <p className="ad-panel__descripcion">Existencias actuales y disponibilidad de lotes en bodega.</p>

      <table className="ad-tabla">
        <thead>
          <tr>
            <th>Código Lote</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Disponible (Kg)</th>
            <th>Estado Stock</th>
          </tr>
        </thead>
        <tbody>
          {inventario.map((item) => (
            <tr key={item.id}>
              <td>#{item.id}</td>
              <td>{item.producto}</td>
              <td>{item.categoria}</td>
              <td>{item.disponibleKg} kg</td>
              <td>
                <span className={ad-etiqueta ad-etiqueta--${item.estado.toLowerCase().replace(' ', '-')}}>
                  {item.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Inventario;
