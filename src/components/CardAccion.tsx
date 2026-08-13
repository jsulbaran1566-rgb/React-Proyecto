import { useState } from 'react';

export interface CardAccionProps {
  titulo: string;
  descripcion: string;
  textoBoton: string;
  onEjecutar: (mensaje: string) => void;
}

function CardAccion({ titulo, descripcion, textoBoton, onEjecutar }: CardAccionProps) {

  const [contadorEjecuciones, setContadorEjecuciones] = useState<number>(0);
  const [cargando, setCargando] = useState<boolean>(false);

  const manejarClick = (): void => {
    setCargando(true);


    setTimeout(() => {
      setContadorEjecuciones((valorAnterior) => valorAnterior + 1);
      setCargando(false);

      onEjecutar(`Se ejecutó la acción "${textoBoton}" sobre "${titulo}"`);
    }, 400);
  };

  return (
    <div className="ad-card-accion">
      <h4 className="ad-card-accion__titulo">{titulo}</h4>
      <p className="ad-card-accion__descripcion">{descripcion}</p>
      <button
        type="button"
        className="ad-card-accion__boton"
        onClick={manejarClick}
        disabled={cargando}
      >
        {cargando ? 'Procesando...' : textoBoton}
      </button>
      {contadorEjecuciones > 0 && (
        <span className="ad-card-accion__contador">
          Ejecutado {contadorEjecuciones} {contadorEjecuciones === 1 ? 'vez' : 'veces'}
        </span>
      )}
    </div>
  );
}

export default CardAccion;
