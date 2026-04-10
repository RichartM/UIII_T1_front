import { useEffect, useState } from 'react';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../api/services';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const { token } = useAuth();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listProducts(token);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.data?.detail || 'Error al cargar productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [token]);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      precio: Number(formData.precio),
      stock: Number(formData.stock),
    };

    try {
      setSaving(true);
      setError(null);

      if (editingId) {
        await updateProduct(editingId, payload, token);
      } else {
        await createProduct(payload, token);
      }

      await loadProducts();
      resetForm();
    } catch (err) {
      setError(
        err?.data?.nombre?.[0] ||
          err?.data?.precio?.[0] ||
          err?.data?.stock?.[0] ||
          err?.data?.detail ||
          'Error al guardar el producto.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const product = await getProduct(productId, token);
      setEditingId(product.id);
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio ?? '',
        stock: product.stock ?? '',
      });
      setShowForm(true);
    } catch (err) {
      setError(err?.data?.detail || 'No se pudo cargar el producto.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      await deleteProduct(productId, token);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      if (editingId === productId) {
        resetForm();
      }
    } catch (err) {
      setError(err?.data?.detail || 'No se pudo eliminar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-md-8">
          <h1>Administracion de productos</h1>
          <p className="text-muted">
          </p>
        </div>
        <div className="col-md-4 text-end">
          <button className="btn btn-outline-primary me-2" type="button" onClick={loadProducts} disabled={loading}>
            Recargar
          </button>
          <button
            className="btn btn-success"
            type="button"
            onClick={() => {
              if (showForm && !editingId) {
                resetForm();
              } else {
                setShowForm(true);
                setEditingId(null);
                setFormData(EMPTY_FORM);
              }
            }}
          >
            {showForm && !editingId ? 'Cerrar' : 'Nuevo producto'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      ) : null}

      {showForm ? (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">
              {editingId ? `Editar producto #${editingId}` : 'Crear nuevo producto'}
            </h5>
            <form onSubmit={handleCreateOrUpdate}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Precio</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="col-md-8">
                  <label className="form-label">Descripcion</label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-success" disabled={saving}>
                    {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {loading && !showForm ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {products.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info text-center py-5 mb-0">
                No hay productos cargados.
              </div>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h6 className="card-title mb-0">{product.nombre}</h6>
                      <span className="badge bg-info text-dark">ID {product.id}</span>
                    </div>
                    <p className="card-text text-muted small">
                      {product.descripcion || 'Sin descripcion.'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-success">
                        ${Number(product.precio || 0).toFixed(2)}
                      </span>
                      <span className="badge bg-secondary">Stock {product.stock}</span>
                    </div>
                  </div>
                  <div className="card-footer bg-light d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      type="button"
                      onClick={() => handleEdit(product.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      type="button"
                      onClick={() => handleDelete(product.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
