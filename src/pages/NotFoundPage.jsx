import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h2 className="fw-bold">Pagina no encontrada</h2>
      <p className="text-secondary">La ruta solicitada no existe en esta aplicacion.</p>
      <Link to="/shop" className="btn btn-primary">
        Volver a la tienda
      </Link>
    </div>
  );
}
