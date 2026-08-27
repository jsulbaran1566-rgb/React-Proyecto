interface HeaderProps {
  titulo: string;
}

function Header({ titulo }: HeaderProps) {
  return (
    <header className="ad-header">
      <div className="ad-header__marca">
        <span className="ad-header__logo">🌾</span>
        <h1 className="ad-header__titulo">{titulo}</h1>
      </div>
      <p className="ad-header__eslogan">Del campo a tu mesa, directo</p>
    </header>
  );
}

export default Header;
