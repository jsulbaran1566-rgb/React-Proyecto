import { Component } from 'react';
import type { FormEvent } from 'react';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerDisputas, crearDisputa } from '../../api/disputasApi';
import type { Disputa } from '../../api/disputasApi';
import { obtenerMensajeError } from '../../api/httpClient';

interface DisputasState {
  disputas: Disputa[];
  cargando: boolean;
  error: string | null;
  enviando: boolean;
}

// Sin hooks: componente de clase. Administrador ve todas las disputas;
// Comprador ve solo las suyas (el backend filtra automáticamente según el
// rol del token).
class Disputas extends Component<Record<string, never>, DisputasState> {
  state: DisputasState = {
    disputas: [],
    cargando: true,
    error: null,
    enviando: false,
  };

  componentDidMount() {
    this.cargarDisputas();
  }

  cargarDisputas = () => {
    this.setState({ cargando: true, error: null });
    obtenerDisputas()
      .then((disputas) => this.setState({ disputas, cargando: false }))
      .catch((error) => this.setState({ error: obtenerMensajeError(error), cargando: false }));
  };

  manejarEnvioDisputa = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const reservaId = Number(datos.get('reservaId'));
    const descripcion = String(datos.get('descripcion') ?? '');

    this.setState({ enviando: true });
    crearDisputa({ reserva_id: reservaId, descripcion })
      .then(() => {
        alert('Disputa registrada. Un administrador la revisará.');
        this.setState({ enviando: false });
        formulario.reset();
        this.cargarDisputas();
      })
      .catch((error) => {
        alert(`No se pudo abrir la disputa: ${obtenerMensajeError(error)}`);
        this.setState({ enviando: false });
      });
  };

  render() {
    const { disputas, cargando, error, enviando } = this.state;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Disputas</h2>
        <p className="ad-panel__descripcion">
          Reclamos abiertos por compradores sobre una reserva (GET /disputas).
        </p>

        <EstadoCarga cargando={cargando} error={error} onReintentar={this.cargarDisputas} />

        {!cargando && !error && (
          <table className="ad-tabla">
            <thead>
              <tr>
                <th>Reserva</th>
                <th>Descripción</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {disputas.map((disputa) => (
                <tr key={disputa.id}>
                  <td>#{disputa.reserva_id}</td>
                  <td>{disputa.descripcion}</td>
                  <td>
                    <span
                      className={`ad-etiqueta ad-etiqueta--disputa-${disputa.estado
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {disputa.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <form className="ad-formulario" onSubmit={this.manejarEnvioDisputa}>
          <label className="ad-formulario__campo">
            ID de reserva
            <input type="number" name="reservaId" placeholder="103" required />
          </label>
          <label className="ad-formulario__campo">
            Descripción del problema
            <input type="text" name="descripcion" placeholder="Describe qué pasó" required />
          </label>
          <button type="submit" className="ad-boton-primario" disabled={enviando}>
            {enviando ? 'Enviando…' : 'Abrir disputa (Comprador)'}
          </button>
        </form>

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Resolver disputa"
            descripcion="Registrar la resolución final de una disputa en revisión (Administrador)."
            textoBoton="Resolver"
            onEjecutar={(mensaje) => alert(`Módulo: Disputas\n${mensaje}`)}
          />
        </div>
      </section>
    );
  }
}

export default Disputas;
