import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

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
    // Simular verificación de autenticación
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (err) {
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Simular llamada al API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Datos de prueba
      const mockUsers = {
        'admin@uci.edu.cu': {
          id: 1,
          email: 'admin@uci.edu.cu',
          name: 'Administrador',
          role: 'admin',
          department: null
        },
        'director@uci.edu.cu': {
          id: 2,
          email: 'director@uci.edu.cu',
          name: 'Director de Formación',
          role: 'director',
          department: null
        },
        'jefe@uci.edu.cu': {
          id: 3,
          email: 'jefe@uci.edu.cu',
          name: 'Jefe de Disciplina',
          role: 'jefe_disciplina',
          department: 'Programación'
        },
        'vicedecano@uci.edu.cu': {
          id: 4,
          email: 'vicedecano@uci.edu.cu',
          name: 'Vicedecano de Formación',
          role: 'vicedecano',
          department: null
        }
      };

      if (mockUsers[email] && password === '123456') {
        const userData = mockUsers[email];
        setUser(userData);
        Cookies.set('user', JSON.stringify(userData), { expires: 7 });
        Cookies.set('token', 'token_' + Date.now(), { expires: 7 });
        return userData;
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Simular registro
      const newUser = {
        id: Math.random(),
        ...data,
        role: 'jefe_disciplina'
      };
      setUser(newUser);
      Cookies.set('user', JSON.stringify(newUser), { expires: 7 });
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
    Cookies.remove('token');
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
