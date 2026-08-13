import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Usuarios from './components/Usuarios';
import Productos from './components/Productos';
import Login from './components/Login';
import Registro from './components/Registro';
import Inventario from './components/Inventario';
import './App.css';

// Actividad 4: componente de FUNCIÓN con useState para manejar la
// navegación (antes era un componente de clase con this.state).
function App() {
  // Estado local: página que se muestra en el contenido principal
  const [pagina, setPagina] = useState<string>('usuarios');

  // Esta función se pasa al Sidebar (Padre -> Hijo) y el Sidebar la invoca
  // cuando el usuario hace clic en una opción (Hijo -> Padre).
  const cambiarPagina = (nuevaPagina: string): void => {
    setPagina(nuevaPagina);
  };

  return (
    <div className="ad-app">
      <Header titulo="AgroDirecto" />

      <div className="ad-app__cuerpo">
        <Sidebar paginaActiva={pagina} onCambiarPagina={cambiarPagina} />

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

export default App;
