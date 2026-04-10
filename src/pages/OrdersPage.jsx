import { useEffect, useState } from 'react';
import { getOrder, getOrderStatus, listUserOrders, updateOrder } from '../api/services';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const { token, user } = useAuth();
  const [orderId, setOrderId] = useState(() => localStorage.getItem('ms_tienda_last_order_id') || '');
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [statusInfo, setStatusInfo] = useState(null);
  const [nextStatus, setNextStatus] = useState('Pagado');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearOrderState = () => {
    setOrder(null);
    setStatusInfo(null);
  };

  const loadOrders = async () => {
    if (!user?.id) {
      return;
    }

    const data = await listUserOrders(user.id, token);
    setOrders(Array.isArray(data) ? data : []);
  };

  const loadOrder = async (targetOrderId = orderId) => {
    if (!targetOrderId) {
      setError('Captura un ID de pedido.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const [orderData, statusData] = await Promise.all([
        getOrder(targetOrderId, token),
        getOrderStatus(targetOrderId, token),
      ]);

      if (Number(orderData.usuario_id) !== Number(user?.id)) {
        clearOrderState();
        setError('No puedes ver pedidos de otro usuario.');
        return;
      }

      setOrder(orderData);
      setStatusInfo(statusData);
      setOrderId(String(targetOrderId));
      localStorage.setItem('ms_tienda_last_order_id', String(targetOrderId));
    } catch (err) {
      clearOrderState();
      setError(err?.data?.detail || 'No se pudo consultar el pedido.');
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async (preferredOrderId = orderId) => {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await listUserOrders(user.id, token);
      const myOrders = Array.isArray(data) ? data : [];
      setOrders(myOrders);

      const nextOrderId =
        preferredOrderId ||
        (myOrders.length > 0 ? String(myOrders[0].id) : '');

      if (!nextOrderId) {
        clearOrderState();
        setOrderId('');
        return;
      }

      const [orderData, statusData] = await Promise.all([
        getOrder(nextOrderId, token),
        getOrderStatus(nextOrderId, token),
      ]);

      setOrder(orderData);
      setStatusInfo(statusData);
      setOrderId(String(nextOrderId));
      localStorage.setItem('ms_tienda_last_order_id', String(nextOrderId));
    } catch (err) {
      clearOrderState();
      setError(err?.data?.detail || 'No se pudieron cargar tus pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!orderId || !order) {
      setError('Primero carga un pedido propio.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const updated = await updateOrder(orderId, { estado: nextStatus }, token);

      if (Number(updated.usuario_id) !== Number(user?.id)) {
        clearOrderState();
        setError('No puedes actualizar pedidos de otro usuario.');
        return;
      }

      setOrder(updated);
      setStatusInfo({
        id: updated.id,
        estado: updated.estado,
        total: updated.total,
        fecha: updated.fecha,
      });
      await loadOrders();
    } catch (err) {
      setError(err?.data?.estado?.[0] || err?.data?.detail || 'No se pudo actualizar el estado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      refreshAll(orderId);
    }
  }, [user?.id]);

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-4">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h4 className="fw-semibold mb-3">Mis pedidos</h4>
            <button
              className="btn btn-outline-primary w-100 mb-3"
              type="button"
              onClick={() => refreshAll(orderId)}
              disabled={loading}
            >
              Recargar mis pedidos
            </button>

            {orders.length > 0 ? (
              <div className="list-group">
                {orders.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${String(item.id) === String(orderId) ? 'active' : ''}`}
                    onClick={() => loadOrder(String(item.id))}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>Pedido #{item.id}</strong>
                      <span className={`badge ${String(item.id) === String(orderId) ? 'bg-light text-dark' : 'bg-primary'}`}>
                        {item.estado}
                      </span>
                    </div>
                    <div className="small mt-1">
                      Total: ${Number(item.total || 0).toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">No tienes pedidos registrados.</p>
            )}
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h4 className="fw-semibold mb-3">Consultar por ID</h4>

            <div className="input-group mb-3">
              <input
                className="form-control"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="ID de pedido"
              />
              <button className="btn btn-outline-primary" type="button" onClick={() => loadOrder()} disabled={loading}>
                Ver
              </button>
            </div>

            <form className="d-grid gap-2" onSubmit={handleUpdateStatus}>
              <label className="form-label mb-0">Actualizar estado</label>
              <select
                className="form-select"
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value)}
              >
                <option value="Pagado">Pagado</option>
                <option value="Enviado">Enviado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
              <button className="btn btn-primary" type="submit" disabled={loading || !order}>
                Guardar estado
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-8">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h4 className="fw-semibold mb-3">Detalle del pedido</h4>

            {loading ? <div className="alert alert-secondary">Consultando...</div> : null}
            {error ? <div className="alert alert-danger">{error}</div> : null}

            {statusInfo ? (
              <div className="alert alert-info">
                <strong>Estado:</strong> {statusInfo.estado}
                <br />
                <strong>Total:</strong> ${Number(statusInfo.total || 0).toFixed(2)}
                <br />
                <strong>Fecha:</strong> {statusInfo.fecha}
              </div>
            ) : null}

            {order ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Pedido #{order.id}</h5>
                  <span className="badge bg-primary">{order.estado}</span>
                </div>

                <div className="mb-3">
                  <strong>Usuario:</strong> {order.usuario_id}
                </div>

                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio unitario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.productos || []).map((product) => (
                        <tr key={`${order.id}-${product.id}`}>
                          <td>{product.nombre || `Producto ${product.id}`}</td>
                          <td>{product.cantidad}</td>
                          <td>${Number(product.precio_unitario || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : !loading ? (
              <p className="text-muted mb-0">Selecciona uno de tus pedidos para ver el detalle.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
