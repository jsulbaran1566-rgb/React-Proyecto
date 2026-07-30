import { useState } from 'react';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  unidad: string;
}

const productosIniciales: Producto[] = [
  { id: 1, nombre: 'Aguacate Hass', categoria: 'Frutas', precio: 3200, unidad: 'kg' },
  { id: 2, nombre: 'Papa Criolla', categoria: 'Tubérculos', precio: 2100, unidad: 'kg' },
  { id: 3, nombre: 'Café Excelso', categoria: 'Granos', precio: 15800, unidad: 'kg' },
];

function Productos() {
  const [productos] = useState<Producto[]>(productosIniciales);

  const formatearPrecio = (valor: number) =>
    valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Productos</h2>
      <p className="ad-panel__descripcion">
        Catálogo de productos agrícolas disponibles.
      </p>

      <div className="ad-tarjetas">
        {productos.map((producto) => (
          <article key={producto.id} className="ad-tarjeta">
            <h3 className="ad-tarjeta__nombre">{producto.nombre}</h3>
            <span className="ad-tarjeta__categoria">{producto.categoria}</span>
            <p className="ad-tarjeta__precio">
              {formatearPrecio(producto.precio)} / {producto.unidad}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Productos;
