import { Component } from 'react';
import type { FormEvent } from 'react';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerEntregas, crearEntrega } from '../../api/entregasApi';
import type { Entrega } from '../../api/entregasApi';
import { obtenerMensajeError } from '../../api/httpClient';

interface EntregasState {
  reservaId: number | null;
  entregas: Entrega[];
  cargando: boolean;
  error: string | null;
  enviando: boolean;
  buscado: boolean;
}

function formatearUbicacion(entrega: Entrega): string {
  if (entrega.latitud_actual === null || entrega.longitud_actual === null) {
    return 'Sin ubicación registrada';
  }
  return `${entrega.latitud_actual.toFixed(4)}, ${entrega.longitud_actual.toFixed(4)}`;
}

// Sin hooks: componente de clase. GET /entregas exige un reserva_id (solo
// el comprador dueño, el productor del lote o un Administrador pueden
// verla), así que este panel funciona como buscador por reserva.
class Entregas extends Component<Record<string, never>, EntregasState> {
  state: EntregasState = {
    reservaId: null,
    entregas: [],
    cargando: false,
    error: null,
    enviando: false,
    buscado: false,
  };

  manejarBusqueda = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const reservaId = Number(datos.get('reservaId'));

    this.setState({ cargando: true, error: null, reservaId, buscado: true });
    obtenerEntregas(reservaId)
      .then((entregas) => this.setState({ entregas, cargando: false }))
      .catch((error) => this.setState({ error: obtenerMensajeError(error), cargando: false }));
  };

  manejarEnvioEntrega = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const reservaId = Number(datos.get('reservaIdNueva'));
    const medio = String(datos.get('medio') ?? '');

    this.setState({ enviando: true });
    crearEntrega({ reserva_id: reservaId, medio })
      .then((entrega) => {
        alert(
          `Entrega registrada. Código de confirmación: ${entrega.codigo_confirmacion}\n` +
            'Compártelo con el comprador para que confirme la recepción.'
        );
        this.setState({ enviando: false });
        formulario.reset();
      })
      .catch((error) => {
        alert(`No se pudo registrar la entrega: ${obtenerMensajeError(error)}`);
        this.setState({ enviando: false });
      });
  };

  render() {
    const { entregas, cargando, error, enviando, buscado } = this.state;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Entregas</h2>
        <p className="ad-panel__descripcion">
          Consulta la entrega asociada a una reserva (GET /entregas?reserva_id=).
        </p>

        <form className="ad-formulario" onSubmit={this.manejarBusqueda}>
          <label className="ad-formulario__campo">
            ID de reserva a consultar
            <input type="number" name="reservaId" placeholder="103" required />
          </label>
          <button type="submit" className="ad-boton-primario">
            Consultar
          </button>
        </form>

        {buscado && <EstadoCarga cargando={cargando} error={error} />}

        {!cargando && !error && buscado && entregas.length === 0 && (
          <p className="ad-panel__descripcion">Esa reserva todavía no tiene entrega registrada.</p>
        )}

        {!cargando && !error && entregas.length > 0 && (
          <table className="ad-tabla">
            <thead>
              <tr>
                <th>Medio</th>
                <th>Estado</th>
                <th>Fecha estimada</th>
                <th>Ubicación actual</th>
              </tr>
            </thead>
            <tbody>
              {entregas.map((entrega) => (
                <tr key={entrega.id}>
                  <td>{entrega.medio}</td>
                  <td>
                    <span
                      className={`ad-etiqueta ad-etiqueta--entrega-${entrega.estado
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {entrega.estado}
                    </span>
                  </td>
                  <td>{entrega.fecha_estimada ?? 'Sin definir'}</td>
                  <td>{formatearUbicacion(entrega)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <form className="ad-formulario" onSubmit={this.manejarEnvioEntrega}>
          <label className="ad-formulario__campo">
            ID de reserva a despachar
            <input type="number" name="reservaIdNueva" placeholder="103" required />
          </label>
          <label className="ad-formulario__campo">
            Medio de transporte
            <input type="text" name="medio" placeholder="Transportes El Cafetal" required />
          </label>
          <button type="submit" className="ad-boton-primario" disabled={enviando}>
            {enviando ? 'Registrando…' : 'Registrar entrega (Productor)'}
          </button>
        </form>

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Actualizar ubicación"
            descripcion="Actualizar la posición actual de una entrega en tránsito (RF-32)."
            textoBoton="Actualizar"
            onEjecutar={(mensaje) => alert(`Módulo: Entregas\n${mensaje}`)}
          />
        </div>
      </section>
    );
  }
}

export default Entregas;
