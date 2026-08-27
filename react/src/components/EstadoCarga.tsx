interface EstadoCargaProps {
  cargando: boolean;
  error: string | null;
  onReintentar?: () => void;
}

// Componente HIJO puramente presentacional (sin hooks). El padre le pasa
// su estado de carga/error por props y decide si renderizarlo o no.
function EstadoCarga({ cargando, error, onReintentar }: EstadoCargaProps) {
  if (cargando) {
    return <p className="ad-estado ad-estado--cargando">Cargando datos…</p>;
  }

  if (error) {
    return (
      <div className="ad-estado ad-estado--error">
        <p>No se pudieron cargar los datos: {error}</p>
        {onReintentar && (
          <button type="button" className="ad-boton-primario" onClick={onReintentar}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return null;
}

export default EstadoCarga;
