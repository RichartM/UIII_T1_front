import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProducts } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackId, setFeedbackId] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.data?.detail || err.message || 'Error al cargar productos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      return;
    }

    addToCart(product);
    setFeedbackId(productId);
    window.setTimeout(() => setFeedbackId((current) => (current === productId ? null : current)), 1200);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="mb-2">Catalogo de productos</h1>
          <p className="text-muted">
            Bienvenido, {user?.nombre_completo || 'usuario'}.
          </p>
        </div>
        <div className="col-md-4 text-end">
          <button className="btn btn-primary" type="button" onClick={() => navigate('/checkout')}>
            Ir al carrito
          </button>
        </div>
      </div>

      {error ? (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" />
        </div>
      ) : null}

      {products.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <p className="mb-0">No hay productos disponibles en este momento.</p>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div key={product.id} className="col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="badge bg-light text-dark">#{product.id}</span>
                    <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  <h5 className="card-title">{product.nombre}</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    {product.descripcion || 'Sin descripcion disponible.'}
                  </p>
                  <p className="card-text mt-auto">
                    <strong className="text-success fs-5">
                      ${Number(product.precio || 0).toFixed(2)}
                    </strong>
                  </p>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock <= 0}
                    >
                      {feedbackId === product.id ? 'Agregado' : 'Agregar al carrito'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
