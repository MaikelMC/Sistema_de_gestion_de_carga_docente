import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar autenticación existente al cargar
    const userCookie = Cookies.get('user');
    const token = Cookies.get('token');
    if (userCookie && token) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (err) {
        Cookies.remove('user');
        Cookies.remove('token');
        Cookies.remove('refresh_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      const { access, refresh, user: userData } = response.data;

      // Guardar tokens y datos del usuario en cookies
      Cookies.set('token', access, { expires: 1 }); // 1 día
      Cookies.set('refresh_token', refresh, { expires: 7 }); // 7 días
      Cookies.set('user', JSON.stringify(userData), { expires: 7 });

      setUser(userData);
      return userData;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Credenciales inválidas';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(data);
      const { access, refresh, user: userData } = response.data;

      // Auto-login después del registro
      Cookies.set('token', access, { expires: 1 });
      Cookies.set('refresh_token', refresh, { expires: 7 });
      Cookies.set('user', JSON.stringify(userData), { expires: 7 });

      setUser(userData);
      return userData;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.password_confirm?.[0] ||
        'Error al registrar el usuario';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
    Cookies.remove('token');
    Cookies.remove('refresh_token');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
