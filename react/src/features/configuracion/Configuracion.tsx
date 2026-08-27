import { Component } from 'react';
import type { FormEvent } from 'react';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerComision, actualizarComision } from '../../api/configuracionApi';
import { obtenerMensajeError } from '../../api/httpClient';

interface ConfiguracionState {
  comisionPct: number | null;
  cargando: boolean;
  error: string | null;
  guardando: boolean;
}

// Sin hooks: componente de clase. Trae y actualiza la comisión real
// (GET/PUT /configuracion/comision — RF-46, solo Administrador puede
// editar; ver la comisión actual es público).
class Configuracion extends Component<Record<string, never>, ConfiguracionState> {
  state: ConfiguracionState = {
    comisionPct: null,
    cargando: true,
    error: null,
    guardando: false,
  };

  componentDidMount() {
    this.cargarComision();
  }

  cargarComision = () => {
    this.setState({ cargando: true, error: null });
    obtenerComision()
      .then(({ comision_pct }) => this.setState({ comisionPct: comision_pct, cargando: false }))
      .catch((error) => this.setState({ error: obtenerMensajeError(error), cargando: false }));
  };

  manejarEnvioConfiguracion = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const comisionPct = Number(datos.get('comision'));

    this.setState({ guardando: true });
    actualizarComision(comisionPct)
      .then(({ comision_pct }) => {
        alert(`Comisión actualizada\nNuevo valor: ${comision_pct}%`);
        this.setState({ comisionPct: comision_pct, guardando: false });
      })
      .catch((error) => {
        alert(`No se pudo actualizar la comisión: ${obtenerMensajeError(error)}`);
        this.setState({ guardando: false });
      });
  };

  render() {
    const { comisionPct, cargando, error, guardando } = this.state;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Configuración</h2>
        <p className="ad-panel__descripcion">
          Comisión que la plataforma cobra sobre cada transacción (RF-46, solo Administrador edita).
        </p>

        <EstadoCarga cargando={cargando} error={error} onReintentar={this.cargarComision} />

        {!cargando && !error && comisionPct !== null && (
          <>
            <p className="ad-tarjeta__precio">Comisión actual: {comisionPct}%</p>

            <form className="ad-formulario" onSubmit={this.manejarEnvioConfiguracion}>
              <label className="ad-formulario__campo">
                Nueva comisión (%)
                <input
                  type="number"
                  name="comision"
                  min="0"
                  max="100"
                  defaultValue={comisionPct}
                  required
                />
              </label>

              <button type="submit" className="ad-boton-primario" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar cambios'}
              </button>
            </form>
          </>
        )}

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Nota sobre la comisión"
            descripcion="El nuevo % aplica solo a los pagos nuevos; los ya procesados conservan la comisión con la que se hicieron."
            textoBoton="Entendido"
            onEjecutar={(mensaje) => alert(`Módulo: Configuración\n${mensaje}`)}
          />
        </div>
      </section>
    );
  }
}

export default Configuracion;
