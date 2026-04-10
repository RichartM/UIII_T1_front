import { useState } from 'react';
import { API_BASE } from '../utils/env';
import { apiRequest } from '../api/http';

export default function ProductsPage() {
  const [product, setProduct] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0
  });
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  const loadProducts = async () => {
    const data = await apiRequest(`${API_BASE.eq2}/api/products/`);
    setProducts(Array.isArray(data) ? data : []);
  };

  const createProduct = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await apiRequest(`${API_BASE.eq2}/api/products/`, {
        method: 'POST',
        body: product
      });
      setMessage('Producto creado correctamente.');
      await loadProducts();
    } catch (err) {
      setMessage(`Error: ${JSON.stringify(err?.data || err)}`);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h4 className="fw-semibold mb-3">Crear producto</h4>
            <form className="d-grid gap-2" onSubmit={createProduct}>
              <input
                className="form-control"
                placeholder="Nombre"
                value={product.nombre}
                onChange={(e) => setProduct({ ...product, nombre: e.target.value })}
                required
              />
              <input
                className="form-control"
                placeholder="Descripcion"
                value={product.descripcion}
                onChange={(e) => setProduct({ ...product, descripcion: e.target.value })}
                required
              />
              <input
                className="form-control"
                type="number"
                step="0.01"
                placeholder="Precio"
                value={product.precio}
                onChange={(e) => setProduct({ ...product, precio: Number(e.target.value) })}
                required
              />
              <input
                className="form-control"
                type="number"
                placeholder="Stock"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                required
              />
              <button className="btn btn-primary" type="submit">
                Guardar producto
              </button>
            </form>
            {message ? <div className="alert alert-info mt-3 mb-0">{message}</div> : null}
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-7">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-semibold mb-0">Listado</h4>
              <button className="btn btn-outline-primary btn-sm" onClick={loadProducts}>
                Actualizar
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>{p.precio}</td>
                      <td>{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
