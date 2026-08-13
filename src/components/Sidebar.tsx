import { useState } from 'react';

interface SidebarProps {
  paginaActiva: string;
  onCambiarPagina: (pagina: string) => void;
}

function Sidebar({ paginaActiva, onCambiarPagina }: SidebarProps) {
  // Estado local: controla si el menú aparece colapsado (solo íconos) o expandido
  const [colapsado, setColapsado] = useState<boolean>(false);

  const opciones = [
    { id: 'usuarios', etiqueta: 'Usuarios', icono: '👤' },
    { id: 'productos', etiqueta: 'Productos', icono: '🌽' },
    { id: 'login', etiqueta: 'Login', icono: '🔐' },
    { id: 'registro', etiqueta: 'Registro', icono: '📝' },
    { id: 'inventario', etiqueta: 'Inventario', icono: '📦' },
  ];

  const alternarColapso = (): void => {
    setColapsado((valorAnterior) => !valorAnterior);
  };

  return (
    <aside className={'ad-sidebar' + (colapsado ? ' ad-sidebar--colapsado' : '')}>
      <button
        type="button"
        className="ad-sidebar__toggle"
        onClick={alternarColapso}
        aria-label={colapsado ? 'Expandir menú' : 'Colapsar menú'}
      >
        {colapsado ? '»' : '« Colapsar'}
      </button>

      <nav>
        <ul className="ad-sidebar__lista">
          {opciones.map((opcion) => (
            <li key={opcion.id}>
              <button
                className={
                  'ad-sidebar__boton' +
                  (paginaActiva === opcion.id ? ' ad-sidebar__boton--activo' : '')
                }
                onClick={() => onCambiarPagina(opcion.id)}
                title={opcion.etiqueta}
              >
                <span className="ad-sidebar__icono">{opcion.icono}</span>
                {!colapsado && opcion.etiqueta}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
