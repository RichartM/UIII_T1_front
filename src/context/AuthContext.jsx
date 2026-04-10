import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { getUserProfile, loginUser, registerUser } from '../api/services';

const AuthContext = createContext(null);

const TOKEN_KEY = 'ms_tienda_token';
const USER_KEY = 'ms_tienda_user';

// Decodificar JWT sin librerías externas
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const decoded = JSON.parse(atob(padded));
    return decoded;
  } catch {
    return null;
  }
}

function userFromToken(token) {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.user_id) return null;
  return {
    id: decoded.user_id,
    email: decoded.email || '',
    nombre_completo: decoded.nombre_completo || decoded.email || ''
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => {
    const fromStorage = localStorage.getItem(USER_KEY);
    if (!fromStorage) return null;
    try {
      const parsed = JSON.parse(fromStorage);
      return parsed && parsed.id ? parsed : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(token && user);

  // Cargar perfil del usuario desde el token o API
  useEffect(() => {
    if (token && (!user || !user.id)) {
      const loadUserProfile = async () => {
        try {
          setLoading(true);
          const decoded = decodeJWT(token);
          
          if (decoded && decoded.user_id) {
            // Fetch del perfil usando el user_id del token
            const profileData = await getUserProfile(decoded.user_id, token);

            setUser(profileData);
            localStorage.setItem(USER_KEY, JSON.stringify(profileData));
          }
        } catch (err) {
          console.error('Error cargando perfil:', err);
          // Si falla, al menos usamos la info del token
          const fallbackUser = userFromToken(token);
          if (fallbackUser) {
            setUser(fallbackUser);
            localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
          }
        } finally {
          setLoading(false);
        }
      };

      loadUserProfile();
    }
  }, [token, user]);

  const login = async ({ email, password }) => {
    const data = await loginUser({ email, password });

    const newToken = data.access || '';
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);

    // Decodificar JWT para obtener user_id
    const nextUser = userFromToken(newToken);
    if (nextUser) {
      if (!nextUser.nombre_completo) {
        nextUser.nombre_completo = email;
      }
      setUser(nextUser);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      // Limpiar estado inválido para forzar recuperación en próxima carga.
      setUser(null);
      localStorage.removeItem(USER_KEY);
    }

    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    if (payload?.email && payload?.password) {
      await login({ email: payload.email, password: payload.password });
    }
    return data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      setUser
    }),
    [token, user, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
