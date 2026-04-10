import { useState } from 'react';
import { API_BASE } from '../utils/env';
import { apiRequest } from '../api/http';

export default function PaymentsPage() {
  const [form, setForm] = useState({
    order_id: 1,
    user_id: 1,
    card_number: '4111111111111111',
    expiration_date: '12/30',
    cvv: '123'
  });
  const [result, setResult] = useState('');

  const processPayment = async (e) => {
    e.preventDefault();
    try {
      const data = await apiRequest(`${API_BASE.eq4}/api/payments/process/`, {
        method: 'POST',
        body: {
          order_id: Number(form.order_id),
          user_id: Number(form.user_id),
          card_number: form.card_number,
          expiration_date: form.expiration_date,
          cvv: form.cvv
        }
      });
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(JSON.stringify(err?.data || err, null, 2));
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h4 className="fw-semibold mb-3">Procesar pago</h4>
            <form className="row g-2" onSubmit={processPayment}>
              <div className="col-md-6">
                <input
                  className="form-control"
                  type="number"
                  value={form.order_id}
                  onChange={(e) => setForm({ ...form, order_id: e.target.value })}
                  placeholder="Order ID"
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  type="number"
                  value={form.user_id}
                  onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                  placeholder="User ID"
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control"
                  value={form.card_number}
                  onChange={(e) => setForm({ ...form, card_number: e.target.value })}
                  placeholder="Numero de tarjeta"
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  value={form.expiration_date}
                  onChange={(e) => setForm({ ...form, expiration_date: e.target.value })}
                  placeholder="MM/YY"
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  value={form.cvv}
                  onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                  placeholder="CVV"
                />
              </div>
              <div className="col-12">
                <button className="btn btn-primary" type="submit">
                  Ejecutar pago
                </button>
              </div>
            </form>

            <pre className="result-box mt-3">{result || 'Sin resultados.'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
