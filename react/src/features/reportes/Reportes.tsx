import { Component } from 'react';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import {
  obtenerReporteAdmin,
  obtenerReporteComprador,
  obtenerReporteProductor,
} from '../../api/reportesApi';
import type { ReporteAdmin, ReporteComprador, ReporteProductor } from '../../api/reportesApi';
import { CLAVE_USUARIO, obtenerMensajeError } from '../../api/httpClient';
import type { UsuarioSesion } from '../../api/authApi';

type ReporteCargado =
  | { rol: 'Productor'; datos: ReporteProductor }
  | { rol: 'Comprador'; datos: ReporteComprador }
  | { rol: 'Administrador'; datos: ReporteAdmin };

interface ReportesState {
  reporte: ReporteCargado | null;
  cargando: boolean;
  error: string | null;
}

function obtenerRolDeSesion(): UsuarioSesion['rol'] | null {
  const crudo = sessionStorage.getItem(CLAVE_USUARIO);
  if (!crudo) return null;
  try {
    return (JSON.parse(crudo) as UsuarioSesion).rol;
  } catch {
    return null;
  }
}

function formatearMonto(valor: number): string {
  return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

// Sin hooks: componente de clase. Trae el reporte real según el rol de la
// sesión (GET /reportes/productor | /comprador | /admin — cada uno con una
// forma de respuesta distinta).
class Reportes extends Component<Record<string, never>, ReportesState> {
  state: ReportesState = {
    reporte: null,
    cargando: true,
    error: null,
  };

  componentDidMount() {
    this.cargarReporte();
  }

  cargarReporte = () => {
    const rol = obtenerRolDeSesion();
    if (!rol) {
      this.setState({ cargando: false, error: 'Inicia sesión para ver tus reportes.' });
      return;
    }

    this.setState({ cargando: true, error: null });

    if (rol === 'Administrador') {
      obtenerReporteAdmin()
        .then((datos) => this.setState({ reporte: { rol: 'Administrador', datos }, cargando: false }))
        .catch((error) => this.setState({ error: obtenerMensajeError(error), cargando: false }));
    } else if (rol === 'Comprador') {
      obtenerReporteComprador()
        .then((datos) => this.setState({ reporte: { rol: 'Comprador', datos }, cargando: false }))
        .catch((error) => this.setState({ error: obtenerMensajeError(error), cargando: false }));
    } else {
      obtenerReporteProductor()
        .then((datos) => this.setState({ reporte: { rol: 'Productor', datos }, cargando: false }))
        .catch((error) => this.setState({ error: obtenerMensajeError(error), cargando: false }));
    }
  };

  renderTarjetas() {
    const { reporte } = this.state;
    if (!reporte) return null;

    if (reporte.rol === 'Productor') {
      const d = reporte.datos;
      return (
        <div className="ad-tarjetas">
          <article className="ad-tarjeta">
            <h3 className="ad-tarjeta__nombre">Kg vendidos</h3>
            <p className="ad-tarjeta__precio">{d.total_kg_vendidos} kg</p>
          </article>
          <article className="ad-tarjeta">
            <h3 className="ad-tarjeta__nombre">Ingresos netos</h3>
            <p className="ad-tarjeta__precio">{formatearMonto(d.ingresos_netos)}</p>
          </article>
          <article className="ad-tarjeta">
            <h3 className="ad-tarjeta__nombre">Lotes activos</h3>
            <p className="ad-tarjeta__precio">{d.lotes_activos}</p>
          </article>
          <article className="ad-tarjeta">
            <h3 className="ad-tarjeta__nombre">Calificación</h3>
            <p className="ad-tarjeta__precio">
              {d.calificacion.promedio ?? 'Sin calificar'} ({d.calificacion.total})
            </p>
          </article>
        </div>
      );
    }

    if (reporte.rol === 'Comprador') {
      const d = reporte.datos;
      return (
        <div className="ad-tarjetas">
          <article className="ad-tarjeta">
            <h3 className="ad-tarjeta__nombre">Total de reservas</h3>
            <p className="ad-tarjeta__precio">{d.total_reservas}</p>
          </article>
          <article className="ad-tarjeta">
            <h3 className="ad-tarjeta__nombre">Total gastado</h3>
            <p className="ad-tarjeta__precio">{formatearMonto(d.total_gastado)}</p>
          </article>
        </div>
      );
    }

    const d = reporte.datos;
    return (
      <div className="ad-tarjetas">
        <article className="ad-tarjeta">
          <h3 className="ad-tarjeta__nombre">Transacciones</h3>
          <p className="ad-tarjeta__precio">{d.volumen_transacciones}</p>
        </article>
        <article className="ad-tarjeta">
          <h3 className="ad-tarjeta__nombre">Monto total</h3>
          <p className="ad-tarjeta__precio">{formatearMonto(d.monto_total_transacciones)}</p>
        </article>
        <article className="ad-tarjeta">
          <h3 className="ad-tarjeta__nombre">Comisión plataforma</h3>
          <p className="ad-tarjeta__precio">{formatearMonto(d.comision_total_plataforma)}</p>
        </article>
        <article className="ad-tarjeta">
          <h3 className="ad-tarjeta__nombre">Disputas totales</h3>
          <p className="ad-tarjeta__precio">{d.total_disputas}</p>
        </article>
        <article className="ad-tarjeta">
          <h3 className="ad-tarjeta__nombre">Usuarios activos</h3>
          <p className="ad-tarjeta__precio">{d.total_usuarios_activos}</p>
        </article>
      </div>
    );
  }

  render() {
    const { cargando, error } = this.state;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Reportes</h2>
        <p className="ad-panel__descripcion">
          Indicadores generales según tu rol (GET /reportes/productor | /comprador | /admin).
        </p>

        <EstadoCarga cargando={cargando} error={error} onReintentar={this.cargarReporte} />

        {!cargando && !error && this.renderTarjetas()}

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Exportar CSV"
            descripcion="Descargar el reporte actual en formato CSV (generado en el cliente)."
            textoBoton="Exportar"
            onEjecutar={(mensaje) => alert(`Módulo: Reportes\n${mensaje}`)}
          />
        </div>
      </section>
    );
  }
}

export default Reportes;
