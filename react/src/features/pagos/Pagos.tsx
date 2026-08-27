import { Component } from 'react';
import type { FormEvent } from 'react';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerPagos, crearPago, METODOS_PAGO_VALIDOS } from '../../api/pagosApi';
import type { ResumenPagosReserva, MetodoPago } from '../../api/pagosApi';
import { obtenerMensajeError } from '../../api/httpClient';

interface PagosState {
  resumen: ResumenPagosReserva | null;
  cargando: boolean;
  error: string | null;
  enviando: boolean;
  buscado: boolean;
}

function formatearMonto(valor: number): string {
  return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

// Sin hooks: componente de clase. GET /pagos exige reserva_id y devuelve un
// resumen de saldo (total, pagado, pendiente) además de la lista de pagos.
class Pagos extends Component<Record<string, never>, PagosState> {
  state: PagosState = {
    resumen: null,
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

    this.setState({ cargando: true, error: null, buscado: true });
    obtenerPagos(reservaId)
      .then((resumen) => this.setState({ resumen, cargando: false }))
      .catch((error) => this.setState({ error: obtenerMensajeError(error), cargando: false }));
  };

  manejarEnvioPago = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const reservaId = Number(datos.get('reservaIdPago'));
    const metodo = String(datos.get('metodo') ?? METODOS_PAGO_VALIDOS[0]) as MetodoPago;
    const montoTexto = datos.get('monto');
    const monto = montoTexto ? Number(montoTexto) : undefined;

    this.setState({ enviando: true });
    crearPago({ reserva_id: reservaId, metodo, monto })
      .then((pago) => {
        alert(
          pago.reserva_completamente_pagada
            ? `Pago aprobado. La reserva #${reservaId} quedó en estado 'Pagada'.`
            : `Abono registrado. Pendiente: ${formatearMonto(pago.monto_pendiente)}.`
        );
        this.setState({ enviando: false });
        formulario.reset();
      })
      .catch((error) => {
        alert(`No se pudo registrar el pago: ${obtenerMensajeError(error)}`);
        this.setState({ enviando: false });
      });
  };

  render() {
    const { resumen, cargando, error, enviando, buscado } = this.state;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Pagos</h2>
        <p className="ad-panel__descripcion">
          Pagos simulados asociados a una reserva (GET/POST /pagos, sin pasarela real).
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

        {!cargando && !error && resumen && (
          <>
            <div className="ad-tarjetas">
              <article className="ad-tarjeta">
                <h3 className="ad-tarjeta__nombre">Total</h3>
                <p className="ad-tarjeta__precio">{formatearMonto(resumen.monto_total_reserva)}</p>
              </article>
              <article className="ad-tarjeta">
                <h3 className="ad-tarjeta__nombre">Pagado</h3>
                <p className="ad-tarjeta__precio">{formatearMonto(resumen.monto_pagado)}</p>
              </article>
              <article className="ad-tarjeta">
                <h3 className="ad-tarjeta__nombre">Pendiente</h3>
                <p className="ad-tarjeta__precio">{formatearMonto(resumen.monto_pendiente)}</p>
              </article>
            </div>

            {resumen.pagos.length > 0 && (
              <table className="ad-tabla">
                <thead>
                  <tr>
                    <th>Monto</th>
                    <th>Tipo</th>
                    <th>Método</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.pagos.map((pago) => (
                    <tr key={pago.id}>
                      <td>{formatearMonto(pago.monto)}</td>
                      <td>{pago.tipo}</td>
                      <td>{pago.metodo}</td>
                      <td>
                        <span className={`ad-etiqueta ad-etiqueta--pago-${pago.estado.toLowerCase()}`}>
                          {pago.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        <form className="ad-formulario" onSubmit={this.manejarEnvioPago}>
          <label className="ad-formulario__campo">
            ID de reserva a pagar
            <input type="number" name="reservaIdPago" placeholder="103" required />
          </label>

          <label className="ad-formulario__campo">
            Método
            <select name="metodo" defaultValue={METODOS_PAGO_VALIDOS[0]}>
              {METODOS_PAGO_VALIDOS.map((metodo) => (
                <option key={metodo} value={metodo}>
                  {metodo}
                </option>
              ))}
            </select>
          </label>

          <label className="ad-formulario__campo">
            Monto (vacío = pagar todo lo pendiente)
            <input type="number" name="monto" placeholder="Opcional" />
          </label>

          <button type="submit" className="ad-boton-primario" disabled={enviando}>
            {enviando ? 'Registrando…' : 'Registrar pago (Comprador)'}
          </button>
        </form>

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Ver comprobante"
            descripcion="Consultar el comprobante simulado de un pago aprobado."
            textoBoton="Ver"
            onEjecutar={(mensaje) => alert(`Módulo: Pagos\n${mensaje}`)}
          />
        </div>
      </section>
    );
  }
}

export default Pagos;
