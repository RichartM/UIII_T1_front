import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-5" to="/shop">
          🛒 Mi Tienda
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/shop">
                🏪 Tienda
              </NavLink>
            </li>
            <li className="nav-item position-relative">
              <NavLink className="nav-link" to="/checkout">
                🛍️ Carrito
                {itemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {itemCount}
                  </span>
                )}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/orders">
                📦 Mis Pedidos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/products">
                ⚙️ Admin
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3 text-white">
            <small className="opacity-75">👤 {user?.nombre_completo || user?.email || 'Usuario'}</small>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>
              🚪 Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
