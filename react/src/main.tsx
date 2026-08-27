import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './store/store'

// <Provider> pone el store de Redux disponible para toda la app, sin
// necesidad de hooks: los componentes lo consumen con connect() (ver
// features/usuarios/Usuarios.tsx y features/productos/Productos.tsx).
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
