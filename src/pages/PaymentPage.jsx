import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getOrder, processPayment } from '../api/services';
import { useAuth } from '../context/AuthContext';

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    card_number: '4111 1111 1111 1111',
    expiration_date: '12/30',
    cvv: '123',
  });
  const [order, setOrder] = useState(location.state?.order || null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!orderId || order) {
      return;
    }

    const loadOrder = async () => {
      try {
        setLoadingOrder(true);
        const data = await getOrder(orderId, token);
        setOrder(data);
      } catch (err) {
        setError(err?.data?.detail || 'No se pudo cargar el pedido.');
      } finally {
        setLoadingOrder(false);
      }
    };

    loadOrder();
  }, [orderId, order, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!orderId || !user?.id) {
      setError('No hay contexto valido para procesar el pago.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await processPayment(
        {
          order_id: Number(orderId),
          user_id: user.id,
          card_number: formData.card_number,
          expiration_date: formData.expiration_date,
          cvv: formData.cvv,
        },
        token
      );

      const pago = data?.pago || data;
      if (pago?.estado !== 'exitoso') {
        throw new Error(data?.advertencia || 'El pago no fue aprobado.');
      }

      setSuccess(true);
      localStorage.setItem('ms_tienda_last_order_id', String(orderId));
      setTimeout(() => navigate('/orders', { replace: true }), 1800);
    } catch (err) {
      setError(err?.data?.error || err.message || 'Error al procesar el pago.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-success text-center py-5">
              <h2 className="mb-3">Pago exitoso</h2>
              <p className="mb-2">Tu pedido #{orderId} quedo registrado correctamente.</p>
              <p className="text-muted small mb-0">Redirigiendo a la vista de pedidos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const total = Number(order?.total ?? location.state?.total ?? 0);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4 text-center">Procesar pago</h2>

              <div className="alert alert-info mb-4">
                <strong>Pedido:</strong> #{orderId}
                <br />
                <strong>Total a pagar:</strong>{' '}
                <span className="text-success fs-5">${total.toFixed(2)}</span>
                {order?.estado ? (
                  <>
                    <br />
                    <strong>Estado actual:</strong> {order.estado}
                  </>
                ) : null}
              </div>

              {loadingOrder ? <div className="alert alert-secondary">Cargando pedido...</div> : null}
              {error ? (
                <div className="alert alert-danger alert-dismissible fade show">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError(null)} />
                </div>
              ) : null}

              <form onSubmit={handleSubmitPayment}>
                <div className="mb-3">
                  <label className="form-label">Numero de tarjeta</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="card_number"
                    placeholder="1234 5678 9012 3456"
                    value={formData.card_number}
                    onChange={handleChange}
                    required
                  />
                  <small className="form-text text-muted">
                    Usa 4111 1111 1111 1111 para exito o una tarjeta terminada en 0000 para rechazo.
                  </small>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha de vencimiento</label>
                    <input
                      type="text"
                      className="form-control"
                      name="expiration_date"
                      placeholder="MM/YY"
                      value={formData.expiration_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CVV</label>
                    <input
                      type="text"
                      className="form-control"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
                    {loading ? 'Procesando...' : 'Pagar ahora'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/checkout')}
                    disabled={loading}
                  >
                    Volver
                  </button>
                </div>
              </form>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
