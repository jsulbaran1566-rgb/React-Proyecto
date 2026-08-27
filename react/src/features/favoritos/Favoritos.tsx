import { Component } from 'react';
import type { FormEvent } from 'react';
import CardAccion from '../../components/CardAccion';
import EstadoCarga from '../../components/EstadoCarga';
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../../api/favoritosApi';
import type { Favorito } from '../../api/favoritosApi';
import { CLAVE_USUARIO, obtenerMensajeError } from '../../api/httpClient';
import type { UsuarioSesion } from '../../api/authApi';

interface FavoritosState {
  favoritos: Favorito[];
  cargando: boolean;
  error: string | null;
  enviando: boolean;
}

function obtenerCompradorIdDeSesion(): number | null {
  const crudo = sessionStorage.getItem(CLAVE_USUARIO);
  if (!crudo) return null;
  try {
    return (JSON.parse(crudo) as UsuarioSesion).id;
  } catch {
    return null;
  }
}

// Sin hooks: componente de clase. Trae los favoritos del comprador
// logueado (GET /favoritos?comprador_id=). El backend exige que
// comprador_id coincida con el usuario autenticado.
class Favoritos extends Component<Record<string, never>, FavoritosState> {
  state: FavoritosState = {
    favoritos: [],
    cargando: true,
    error: null,
    enviando: false,
  };

  componentDidMount() {
    this.cargarFavoritos();
  }

  cargarFavoritos = () => {
    const compradorId = obtenerCompradorIdDeSesion();
    if (!compradorId) {
      this.setState({
        cargando: false,
        error: 'Inicia sesión como comprador para ver tus favoritos.',
      });
      return;
    }

    this.setState({ cargando: true, error: null });
    obtenerFavoritos(compradorId)
      .then((favoritos) => this.setState({ favoritos, cargando: false }))
      .catch((error) => this.setState({ error: obtenerMensajeError(error), cargando: false }));
  };

  manejarEnvioFavorito = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const productorId = Number(datos.get('productorId'));

    this.setState({ enviando: true });
    agregarFavorito(productorId)
      .then(() => {
        this.setState({ enviando: false });
        formulario.reset();
        this.cargarFavoritos();
      })
      .catch((error) => {
        alert(`No se pudo agregar el favorito: ${obtenerMensajeError(error)}`);
        this.setState({ enviando: false });
      });
  };

  manejarQuitarFavorito = (productorId: number) => {
    const compradorId = obtenerCompradorIdDeSesion();
    if (!compradorId) return;

    quitarFavorito(compradorId, productorId)
      .then(() => this.cargarFavoritos())
      .catch((error) => alert(`No se pudo quitar el favorito: ${obtenerMensajeError(error)}`));
  };

  render() {
    const { favoritos, cargando, error, enviando } = this.state;

    return (
      <section className="ad-panel">
        <h2 className="ad-panel__titulo">Productores favoritos</h2>
        <p className="ad-panel__descripcion">
          Productores que el comprador marcó como favoritos (GET /favoritos).
        </p>

        <EstadoCarga cargando={cargando} error={error} onReintentar={this.cargarFavoritos} />

        {!cargando && !error && (
          <div className="ad-tarjetas">
            {favoritos.map((favorito) => (
              <article key={favorito.productor_id} className="ad-tarjeta">
                <h3 className="ad-tarjeta__nombre">{favorito.productor}</h3>
                <span className="ad-tarjeta__categoria">
                  {favorito.ciudad ?? 'Ciudad no registrada'}
                </span>
                <button
                  type="button"
                  className="ad-boton-primario"
                  onClick={() => this.manejarQuitarFavorito(favorito.productor_id)}
                >
                  Quitar
                </button>
              </article>
            ))}
          </div>
        )}

        <form className="ad-formulario" onSubmit={this.manejarEnvioFavorito}>
          <label className="ad-formulario__campo">
            ID del productor a agregar
            <input type="number" name="productorId" placeholder="12" required />
          </label>
          <button type="submit" className="ad-boton-primario" disabled={enviando}>
            {enviando ? 'Agregando…' : 'Agregar favorito'}
          </button>
        </form>

        <div className="ad-cards-accion">
          <CardAccion
            titulo="Explorar productores"
            descripcion="Ver el catálogo completo de productores disponibles."
            textoBoton="Explorar"
            onEjecutar={(mensaje) => alert(`Módulo: Favoritos\n${mensaje}`)}
          />
        </div>
      </section>
    );
  }
}

export default Favoritos;
