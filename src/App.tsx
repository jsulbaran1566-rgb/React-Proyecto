import { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Usuarios from './components/Usuarios';
import Productos from './components/Productos';
import Login from './components/Login';
import Registro from './components/Registro';
import Inventario from './components/Inventario';
import './App.css';

// La actividad prohíbe el uso de hooks (useState, etc.), por eso App
// se implementa como componente de CLASE: this.state / this.setState
// no son hooks, son la forma "clásica" de manejar estado en React.
interface AppState {
  // Página que se muestra en el contenido principal
  pagina: string; // 'usuarios' | 'productos' | 'login' | 'registro' | 'inventario'
}

class App extends Component<Record<string, never>, AppState> {
  state: AppState = {
    pagina: 'usuarios',
  };

  // Esta función se pasa al Sidebar (Padre -> Hijo) y el Sidebar la invoca
  // cuando el usuario hace clic en una opción (Hijo -> Padre).
  cambiarPagina = (pagina: string) => {
    this.setState({ pagina });
  };

  render() {
    const { pagina } = this.state;

    return (
      <div className="ad-app">
        <Header titulo="AgroDirecto" />

        <div className="ad-app__cuerpo">
          <Sidebar paginaActiva={pagina} onCambiarPagina={this.cambiarPagina} />

          {/* Lógica para mostrar un componente u otro */}
          <main className="ad-app__contenido">
            {pagina === 'usuarios' && <Usuarios />}
            {pagina === 'productos' && <Productos />}
            {pagina === 'login' && <Login />}
            {pagina === 'registro' && <Registro />}
            {pagina === 'inventario' && <Inventario />}
          </main>
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
