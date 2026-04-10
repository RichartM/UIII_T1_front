import { API_BASE } from '../utils/env';

export default function DashboardPage() {
  const cards = [
    {
      title: 'Auth Service',
      text: 'Gestion de usuarios, login y JWT.',
      url: API_BASE.eq1
    },
    {
      title: 'Products Service',
      text: 'Catalogo de productos y stock.',
      url: API_BASE.eq2
    },
    {
      title: 'Orders Service',
      text: 'Creacion y seguimiento de pedidos.',
      url: API_BASE.eq3
    },
    {
      title: 'Payments Service',
      text: 'Procesamiento de pagos del pedido.',
      url: API_BASE.eq4
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Panel de control</h2>
        <p className="text-secondary mb-0">
          Aqui puedes navegar por modulos separados para operar tus microservicios.
        </p>
      </div>

      <div className="row g-3">
        {cards.map((card) => (
          <div className="col-12 col-md-6" key={card.title}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title fw-semibold">{card.title}</h5>
                <p className="card-text text-secondary">{card.text}</p>
                <code>{card.url}</code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
