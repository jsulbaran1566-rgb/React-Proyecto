import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Usuarios from './components/Usuarios';
import Productos from './components/Productos';
import './App.css';

function App() {
  // Definimos qué página mostrar: 'usuarios' o 'productos'
  const [pagina, setPagina] = useState<string>('usuarios');

  return (
    <div className="ad-app">
      <Header titulo="AgroDirecto" />

      <div className="ad-app__cuerpo">
        <Sidebar paginaActiva={pagina} onCambiarPagina={setPagina} />

        {/* Lógica para mostrar un componente u otro */}
        <main className="ad-app__contenido">
          {pagina === 'usuarios' && <Usuarios />}
          {pagina === 'productos' && <Productos />}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
