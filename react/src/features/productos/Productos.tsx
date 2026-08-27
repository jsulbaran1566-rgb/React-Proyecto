import { Component } from 'react';
import { connect } from 'react-redux';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import type { RootState, AppDispatch } from '../../store/store';
import { cargarProductos } from '../../store/productos/productosActions';
import type { Lote } from '../../api/lotesApi';

interface ProductosPropsDelState {
  lotes: Lote[];
  cargando: boolean;
  error: string | null;
}

interface ProductosPropsDelDispatch {
  cargarProductos: () => void;
}

type ProductosProps = ProductosPropsDelState & ProductosPropsDelDispatch;

function formatearPrecio(valor: number | null): string {
  if (valor === null) return 'Sin precio';
  return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

// Igual que Usuarios.tsx: componente de CLASE conectado al store global de
// Redux con connect() (sin hooks). Los lotes ya no viven en this.state,
// sino en state.productos del store, disponibles para toda la app.
class Productos extends Component<ProductosProps> {
  componentDidMount() {
    this.props.cargarProductos();
  }

  manejarAccionProductos = (mensaje: string) => {
    alert(`Módulo: Productos\n${mensaje}`);
    console.log(`[Productos] ${mensaje}`);
  };

  render() {
    const { lotes, cargando, error, cargarProductos: recargar } = this.props;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Productos</h2>
        <p className="ad-panel__descripcion">
          Catálogo de lotes agrícolas disponibles (GET /lotes), desde Redux.
        </p>

        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />

        {!cargando && !error && (
          <div className="ad-tarjetas">
            {lotes.map((lote) => (
              <article key={lote.id} className="ad-tarjeta">
                <h3 className="ad-tarjeta__nombre">{lote.producto}</h3>
                <span className="ad-tarjeta__categoria">{lote.categoria}</span>
                <p className="ad-tarjeta__precio">{formatearPrecio(lote.precio_kg)} / kg</p>
              </article>
            ))}
          </div>
        )}

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Nuevo producto"
            descripcion="Publicar un nuevo lote en el catálogo."
            textoBoton="Publicar"
            onEjecutar={this.manejarAccionProductos}
          />
          <CardAccion
            titulo="Actualizar precios"
            descripcion="Sincronizar precios con el último reporte de mercado."
            textoBoton="Actualizar"
            onEjecutar={this.manejarAccionProductos}
          />
        </div>
      </section>
    );
  }
}

function mapStateToProps(state: RootState): ProductosPropsDelState {
  return {
    lotes: state.productos.lista,
    cargando: state.productos.cargando,
    error: state.productos.error,
  };
}

function mapDispatchToProps(dispatch: AppDispatch): ProductosPropsDelDispatch {
  return {
    cargarProductos: () => dispatch(cargarProductos()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Productos);
