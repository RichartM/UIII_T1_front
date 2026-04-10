import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LOGIN_DEFAULT = {
  email: 'juan@example.com',
  password: 'Pass1234!',
};

const REGISTER_DEFAULT = {
  nombre_completo: '',
  email: '',
  password: '',
  direccion_envio: '',
  telefono: '',
};

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(LOGIN_DEFAULT);
  const [registerForm, setRegisterForm] = useState(REGISTER_DEFAULT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/shop';

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginForm);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.data?.detail || 'No fue posible iniciar sesion.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(registerForm);
      navigate('/shop', { replace: true });
    } catch (err) {
      const firstError =
        err?.data?.email?.[0] ||
        err?.data?.password?.[0] ||
        err?.data?.nombre_completo?.[0] ||
        err?.data?.direccion_envio?.[0] ||
        err?.data?.telefono?.[0];
      setError(firstError || 'No fue posible registrar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center login-bg login-pattern px-3">
      <div className="card border-0 shadow-lg login-card">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex gap-2 mb-4">
            <button
              className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-outline-primary'} flex-fill`}
              type="button"
              onClick={() => setMode('login')}
            >
              Iniciar sesion
            </button>
            <button
              className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-outline-primary'} flex-fill`}
              type="button"
              onClick={() => setMode('register')}
            >
              Registrarse
            </button>
          </div>

          <h1 className="h3 fw-bold mb-1">
            {mode === 'login' ? 'Acceso a la tienda' : 'Crear cuenta'}
          </h1>
          <p className="text-secondary mb-4">
            {mode === 'login'
              ? ''
              : 'Registra un usuario nuevo en el MS de login y entra de inmediato.'}
          </p>

          {error ? <div className="alert alert-danger">{error}</div> : null}

          {mode === 'login' ? (
            <form onSubmit={onSubmitLogin} className="d-grid gap-3">
              <div>
                <label className="form-label">Correo</label>
                <input
                  className="form-control"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Contrasena</label>
                <input
                  className="form-control"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>

              <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
                {loading ? 'Ingresando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={onSubmitRegister} className="d-grid gap-3">
              <div>
                <label className="form-label">Nombre completo</label>
                <input
                  className="form-control"
                  value={registerForm.nombre_completo}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, nombre_completo: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="form-label">Correo</label>
                <input
                  className="form-control"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Contrasena</label>
                <input
                  className="form-control"
                  type="password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, password: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="form-label">Direccion de envio</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={registerForm.direccion_envio}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, direccion_envio: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="form-label">Telefono</label>
                <input
                  className="form-control"
                  value={registerForm.telefono}
                  onChange={(e) => setRegisterForm({ ...registerForm, telefono: e.target.value })}
                />
              </div>

              <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Registrar y entrar'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
