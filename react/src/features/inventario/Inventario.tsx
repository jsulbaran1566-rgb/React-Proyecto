import { Component } from 'react';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerLotes } from '../../api/lotesApi';
import type { Lote } from '../../api/lotesApi';
import { obtenerMensajeError } from '../../api/httpClient';

interface InventarioState {
  lotes: Lote[];
  cargando: boolean;
  error: string | null;
}

function calcularDisponible(lote: Lote): number {
  return lote.cantidad - lote.kg_reservados;
}

function calcularEstado(lote: Lote): 'Disponible' | 'Bajo' | 'Agotado' {
  const disponible = calcularDisponible(lote);
  if (disponible <= 0) return 'Agotado';
  if (disponible < lote.cantidad * 0.2) return 'Bajo';
  return 'Disponible';
}

// Sin hooks: componente de clase. La existencia disponible se deriva de
// cantidad - kg_reservados de cada lote (GET /lotes).
class Inventario extends Component<Record<string, never>, InventarioState> {
  state: InventarioState = {
    lotes: [],
    cargando: true,
    error: null,
  };

  componentDidMount() {
    this.cargarInventario();
  }

  cargarInventario = () => {
    this.setState({ cargando: true, error: null });
    obtenerLotes()
      .then((lotes) => this.setState({ lotes, cargando: false }))
      .catch((error) => this.setState({ error: obtenerMensajeError(error), cargando: false }));
  };

  manejarAccionInventario = (mensaje: string) => {
    alert(`Módulo: Inventario\n${mensaje}`);
    console.log(`[Inventario] ${mensaje}`);
  };

  render() {
    const { lotes, cargando, error } = this.state;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Inventario</h2>
        <p className="ad-panel__descripcion">
          Existencias disponibles por lote (cantidad − kg reservados).
        </p>

        <EstadoCarga cargando={cargando} error={error} onReintentar={this.cargarInventario} />

        {!cargando && !error && (
          <table className="ad-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Disponible</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((lote) => {
                const estado = calcularEstado(lote);
                return (
                  <tr key={lote.id}>
                    <td>{lote.producto}</td>
                    <td>{calcularDisponible(lote)} kg</td>
                    <td>
                      <span className={`ad-etiqueta ad-etiqueta--inv-${estado.toLowerCase()}`}>
                        {estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Reabastecer stock"
            descripcion="Generar una orden de reabastecimiento para los productos bajos o agotados."
            textoBoton="Reabastecer"
            onEjecutar={this.manejarAccionInventario}
          />
          <CardAccion
            titulo="Generar reporte"
            descripcion="Exportar el estado actual del inventario en PDF."
            textoBoton="Generar"
            onEjecutar={this.manejarAccionInventario}
          />
        </div>
      </section>
    );
  }
}

export default Inventario;
