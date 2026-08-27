import { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRouter from './routers/AppRouter';
import { SesionProvider } from './context/SesionContext';
import './App.css';

// App ya no guarda la página activa (eso ahora vive en el AppRouter, que
// escucha la URL) ni maneja hooks: sigue siendo un componente de CLASE,
// simplemente porque el shell (Header + Footer envolviendo el router) no
// necesita estado propio.
class App extends Component {
  render() {
    return (
      // SesionProvider (Context, sin hooks) envuelve toda la app para que
      // Header y Sidebar sepan si hay un usuario logueado y con qué rol.
      <SesionProvider>
        <div className="ad-app">
          <Header titulo="AgroDirecto" />
          <AppRouter />
          <Footer />
        </div>
      </SesionProvider>
    );
  }
}

export default App;
