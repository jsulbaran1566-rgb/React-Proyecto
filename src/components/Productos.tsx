import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import CardAccion from './CardAccion';

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

function formatearPrecio(valor: number): string {
  return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

function Productos() {
  // Estado local: lista de productos (ahora dinámica, ya no es constante estática)
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);

  // Estado local del formulario de "nuevo producto"
  const [nombreNuevo, setNombreNuevo] = useState<string>('');
  const [categoriaNueva, setCategoriaNueva] = useState<string>('');
  const [precioNuevo, setPrecioNuevo] = useState<number>(0);

  // Estado local: texto de búsqueda para filtrar el catálogo
  const [filtro, setFiltro] = useState<string>('');

  const manejarCambioNombreNuevo = (evento: ChangeEvent<HTMLInputElement>): void => {
    setNombreNuevo(evento.target.value);
  };

  const manejarCambioCategoriaNueva = (evento: ChangeEvent<HTMLInputElement>): void => {
    setCategoriaNueva(evento.target.value);
  };

  const manejarCambioPrecioNuevo = (evento: ChangeEvent<HTMLInputElement>): void => {
    setPrecioNuevo(Number(evento.target.value));
  };

  const manejarCambioFiltro = (evento: ChangeEvent<HTMLInputElement>): void => {
    setFiltro(evento.target.value);
  };

  const manejarAgregarProducto = (evento: FormEvent<HTMLFormElement>): void => {
    evento.preventDefault();

    const nuevoProducto: Producto = {
      id: Date.now(),
      nombre: nombreNuevo,
      categoria: categoriaNueva,
      precio: precioNuevo,
      unidad: 'kg',
    };

    setProductos((listaAnterior) => [...listaAnterior, nuevoProducto]);

    // Limpiar el formulario luego de agregar
    setNombreNuevo('');
    setCategoriaNueva('');
    setPrecioNuevo(0);
  };

  // Función del padre (Productos) que el hijo (CardAccion) invoca al interactuar
  const manejarAccionProductos = (mensaje: string): void => {
    alert(`Módulo: Productos\n${mensaje}`);
    console.log(`[Productos] ${mensaje}`);
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <section className="ad-panel">
      <h2 className="ad-panel__titulo">Productos</h2>
      <p className="ad-panel__descripcion">
        Catálogo de productos agrícolas disponibles.
      </p>

      <input
        type="text"
        className="ad-buscador"
        placeholder="Buscar producto por nombre..."
        value={filtro}
        onChange={manejarCambioFiltro}
      />

      <div className="ad-tarjetas">
        {productosFiltrados.map((producto) => (
          <article key={producto.id} className="ad-tarjeta">
            <h3 className="ad-tarjeta__nombre">{producto.nombre}</h3>
            <span className="ad-tarjeta__categoria">{producto.categoria}</span>
            <p className="ad-tarjeta__precio">
              {formatearPrecio(producto.precio)} / {producto.unidad}
            </p>
          </article>
        ))}
        {productosFiltrados.length === 0 && (
          <p className="ad-panel__descripcion">No se encontraron productos.</p>
        )}
      </div>

      <div className="ad-fila-formulario">
        {/* Formulario de gestión: agregar un producto nuevo al catálogo */}
        <form className="ad-formulario" onSubmit={manejarAgregarProducto}>
          <h3 className="ad-panel__titulo" style={{ fontSize: '1.1rem' }}>
            Nuevo producto
          </h3>

          <label className="ad-formulario__campo">
            Nombre
            <input
              type="text"
              placeholder="Ej: Mango Tommy"
              value={nombreNuevo}
              onChange={manejarCambioNombreNuevo}
              required
            />
          </label>

          <label className="ad-formulario__campo">
            Categoría
            <input
              type="text"
              placeholder="Ej: Frutas"
              value={categoriaNueva}
              onChange={manejarCambioCategoriaNueva}
              required
            />
          </label>

          <label className="ad-formulario__campo">
            Precio por kg
            <input
              type="number"
              min={0}
              placeholder="0"
              value={precioNuevo === 0 ? '' : precioNuevo}
              onChange={manejarCambioPrecioNuevo}
              required
            />
          </label>

          <button type="submit" className="ad-boton-primario">
            Publicar producto
          </button>
        </form>

        {/* Visualización en vivo de los datos que el usuario va ingresando */}
        <div className="ad-vista-previa">
          <h4 className="ad-vista-previa__titulo">Vista previa del nuevo producto</h4>
          <p>
            <strong>Nombre:</strong> {nombreNuevo || '(sin ingresar)'}
          </p>
          <p>
            <strong>Categoría:</strong> {categoriaNueva || '(sin ingresar)'}
          </p>
          <p>
            <strong>Precio:</strong> {precioNuevo > 0 ? formatearPrecio(precioNuevo) : '(sin ingresar)'}
          </p>
          <p>
            <strong>Total de productos en catálogo:</strong> {productos.length}
          </p>
        </div>
      </div>

      <div className="ad-cards-accion">
        <CardAccion
          titulo="Actualizar precios"
          descripcion="Sincronizar precios con el último reporte de mercado."
          textoBoton="Actualizar"
          onEjecutar={manejarAccionProductos}
        />
      </div>
    </section>
  );
}

export default Productos;
