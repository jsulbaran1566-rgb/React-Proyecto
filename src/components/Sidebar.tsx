interface SidebarProps {
  paginaActiva: string;
  onCambiarPagina: (pagina: string) => void;
}

function Sidebar({ paginaActiva, onCambiarPagina }: SidebarProps) {
  const opciones = [
    { id: 'usuarios', etiqueta: 'Usuarios', icono: '👤' },
    { id: 'productos', etiqueta: 'Productos', icono: '🌽' },
    { id: 'login', etiqueta: 'Login', icono: '🔐' },
    { id: 'registro', etiqueta: 'Registro', icono: '📝' },
    { id: 'inventario', etiqueta: 'Inventario', icono: '📦' },
  ];

  return (
    <aside className="ad-sidebar">
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
              >
                <span className="ad-sidebar__icono">{opcion.icono}</span>
                {opcion.etiqueta}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
