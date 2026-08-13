// Componente HIJO reutilizable.
// Recibe información del padre por props y, cuando el usuario interactúa,
// avisa al padre invocando la función callback "onEjecutar" (Hijo -> Padre).

export interface CardAccionProps {
  titulo: string;
  descripcion: string;
  textoBoton: string;
  onEjecutar: (mensaje: string) => void;
}

function CardAccion({ titulo, descripcion, textoBoton, onEjecutar }: CardAccionProps) {
  const manejarClick = () => {
    // Comunicación Hijo -> Padre: se ejecuta la función que el padre envió por props
    onEjecutar(`Se ejecutó la acción "${textoBoton}" sobre "${titulo}"`);
  };

  return (
    <div className="ad-card-accion">
      <h4 className="ad-card-accion__titulo">{titulo}</h4>
      <p className="ad-card-accion__descripcion">{descripcion}</p>
      <button type="button" className="ad-card-accion__boton" onClick={manejarClick}>
        {textoBoton}
      </button>
    </div>
  );
}

export default CardAccion;
