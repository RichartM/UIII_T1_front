import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';

export default function CheckoutPage() {
  const { cart, total, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      setError('El carrito esta vacio.');
      return;
    }

    if (!user?.id) {
      setError('Usuario no autenticado. Inicia sesion de nuevo.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await createOrder(
        {
          usuario_id: user.id,
          productos: cart.map((product) => ({
            id: product.id,
            cantidad: product.cantidad,
          })),
        },
        token
      );

      if (!data?.id) {
        throw new Error('No se recibio ID de pedido.');
      }

      clearCart();
      navigate(`/payment/${data.id}`, { state: { total: data.total || total, orderId: data.id } });
    } catch (err) {
      const detail =
        err?.data?.non_field_errors?.[0] ||
        err?.data?.detail ||
        err?.data?.productos?.[0] ||
        err?.data?.usuario_id?.[0];
      setError(detail || err.message || 'Error al crear el pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          <h1 className="mb-4">Carrito de compras</h1>

          {error ? (
            <div className="alert alert-danger alert-dismissible fade show">
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)} />
            </div>
          ) : null}

          {cart.length === 0 ? (
            <div className="alert alert-info text-center py-5">
              <p className="mb-2">Tu carrito esta vacio.</p>
              <Link to="/shop" className="link-primary">
                Volver a la tienda
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.nombre}</strong>
                        {item.descripcion ? (
                          <div className="small text-muted">{item.descripcion}</div>
                        ) : null}
                      </td>
                      <td>${Number(item.precio || 0).toFixed(2)}</td>
                      <td>
                        <div className="input-group input-group-sm" style={{ width: '110px' }}>
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="form-control text-center"
                            value={item.cantidad}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold">
                        ${(Number(item.precio || 0) * item.cantidad).toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm sticky-top" style={{ top: '80px' }}>
            <div className="card-body">
              <h5 className="card-title mb-3">Resumen del pedido</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Articulos</span>
                <span className="fw-bold">{cart.reduce((sum, p) => sum + p.cantidad, 0)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                <span>Total</span>
                <span className="fw-bold fs-5 text-success">${total.toFixed(2)}</span>
              </div>

              {cart.length > 0 ? (
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary btn-lg"
                    type="button"
                    onClick={handleCreateOrder}
                    disabled={loading}
                  >
                    {loading ? 'Creando pedido...' : 'Proceder al pago'}
                  </button>
                  <Link to="/shop" className="btn btn-outline-secondary">
                    Seguir comprando
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
