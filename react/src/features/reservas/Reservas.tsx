import { Component } from 'react';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerReservas } from '../../api/reservasApi';
import type { Reserva } from '../../api/reservasApi';
import { obtenerMensajeError } from '../../api/httpClient';

interface ReservasState {
  reservas: Reserva[];
  cargando: boolean;
  error: string | null;
}

// Sin hooks: componente de clase. Trae las reservas reales (GET /reservas).
class Reservas extends Component<Record<string, never>, ReservasState> {
  state: ReservasState = {
    reservas: [],
    cargando: true,
    error: null,
  };

  componentDidMount() {
    this.cargarReservas();
  }

  cargarReservas = () => {
    this.setState({ cargando: true, error: null });
    obtenerReservas()
      .then((reservas) => this.setState({ reservas, cargando: false }))
      .catch((error) => this.setState({ error: obtenerMensajeError(error), cargando: false }));
  };

  manejarAccionReservas = (mensaje: string) => {
    alert(`Módulo: Reservas\n${mensaje}`);
    console.log(`[Reservas] ${mensaje}`);
  };

  render() {
    const { reservas, cargando, error } = this.state;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Reservas</h2>
        <p className="ad-panel__descripcion">
          Reservas realizadas por compradores sobre los lotes publicados (GET /reservas).
        </p>

        <EstadoCarga cargando={cargando} error={error} onReintentar={this.cargarReservas} />

        {!cargando && !error && (
          <table className="ad-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Comprador</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.producto}</td>
                  <td>{reserva.comprador}</td>
                  <td>{reserva.cantidad} kg</td>
                  <td>
                    <span
                      className={`ad-etiqueta ad-etiqueta--reserva-${reserva.estado
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {reserva.estado}
                    </span>
                  </td>
                  <td>{reserva.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Nueva reserva"
            descripcion="Reservar cantidad de un lote disponible (solo Comprador)."
            textoBoton="Reservar"
            onEjecutar={this.manejarAccionReservas}
          />
          <CardAccion
            titulo="Cancelar reserva"
            descripcion="Cancelar una reserva indicando el motivo de la cancelación."
            textoBoton="Cancelar"
            onEjecutar={this.manejarAccionReservas}
          />
        </div>
      </section>
    );
  }
}

export default Reservas;
