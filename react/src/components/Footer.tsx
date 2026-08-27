function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="ad-footer">
      <p>© {anio} AgroDirecto — Conectando productores y compradores</p>
    </footer>
  );
}

export default Footer;
