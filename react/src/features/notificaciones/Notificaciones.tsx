import { Component } from 'react';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerNotificaciones, marcarTodasLeidas } from '../../api/notificacionesApi';
import type { Notificacion } from '../../api/notificacionesApi';
import { obtenerMensajeError } from '../../api/httpClient';

interface NotificacionesState {
  notificaciones: Notificacion[];
  noLeidas: number;
  cargando: boolean;
  error: string | null;
}

// Sin hooks: componente de clase. GET /notificaciones devuelve
// { no_leidas, notificaciones } (no un array plano).
class Notificaciones extends Component<Record<string, never>, NotificacionesState> {
  state: NotificacionesState = {
    notificaciones: [],
    noLeidas: 0,
    cargando: true,
    error: null,
  };

  componentDidMount() {
    this.cargarNotificaciones();
  }

  cargarNotificaciones = () => {
    this.setState({ cargando: true, error: null });
    obtenerNotificaciones()
      .then(({ notificaciones, no_leidas }) =>
        this.setState({ notificaciones, noLeidas: no_leidas, cargando: false })
      )
      .catch((error) => this.setState({ error: obtenerMensajeError(error), cargando: false }));
  };

  manejarMarcarTodas = () => {
    marcarTodasLeidas()
      .then(() => {
        alert('Todas las notificaciones fueron marcadas como leídas');
        this.cargarNotificaciones();
      })
      .catch((error) => alert(`No se pudo actualizar: ${obtenerMensajeError(error)}`));
  };

  render() {
    const { notificaciones, noLeidas, cargando, error } = this.state;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Notificaciones {noLeidas > 0 && `(${noLeidas} nuevas)`}</h2>
        <p className="ad-panel__descripcion">
          Avisos sobre reservas, entregas y pagos (GET /notificaciones).
        </p>

        <EstadoCarga cargando={cargando} error={error} onReintentar={this.cargarNotificaciones} />

        {!cargando && !error && (
          <table className="ad-tabla">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Mensaje</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {notificaciones.map((notificacion) => (
                <tr key={notificacion.id}>
                  <td>{notificacion.tipo}</td>
                  <td>{notificacion.mensaje}</td>
                  <td>{notificacion.fecha}</td>
                  <td>
                    <span
                      className={`ad-etiqueta ${
                        notificacion.leida ? 'ad-etiqueta--notif-leida' : 'ad-etiqueta--notif-nueva'
                      }`}
                    >
                      {notificacion.leida ? 'Leída' : 'Nueva'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Marcar todas como leídas"
            descripcion="Marcar todas las notificaciones pendientes como leídas."
            textoBoton="Marcar todas"
            onEjecutar={this.manejarMarcarTodas}
          />
        </div>
      </section>
    );
  }
}

export default Notificaciones;
