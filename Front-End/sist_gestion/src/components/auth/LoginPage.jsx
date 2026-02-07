import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../auth/Auth.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Validar email institucional
  const validateEmailDomain = (emailValue) => {
    return emailValue.endsWith('@uci.cu');
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Validación en tiempo real
    if (value !== '' && !validateEmailDomain(value)) {
      setEmailError('Debe usar un correo institucional UCI (@uci.cu)');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailError('');

    // Validar email institucional
    if (!validateEmailDomain(email)) {
      setEmailError('Debe usar un correo institucional UCI (@uci.cu)');
      setLoading(false);
      return;
    }

    try {
      const userData = await login(email, password);
      
      // Navegar al dashboard - el DashboardRouter se encarga del routing según rol
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container login-page">
      {/* Panel lateral */}
      <div className="auth-sidebar">
        <div className="sidebar-content">
          <h1>Sistema de Gestión de Carga Docente</h1>
          <p className="subtitle">Universidad de las Ciencias Informáticas</p>
          <p>Accede a la plataforma para gestionar la carga docente de manera eficiente.</p>
          <div className="uci-badge">
            <span>UCI - EXCELENCIA ACADÉMICA</span>
          </div>
        </div>
      </div>

      {/* Panel de formulario */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="form-header">
            <h2>Iniciar Sesión</h2>
            <p>Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="required">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="usuario@uci.cu"
                required
                className={emailError ? 'input-error' : ''}
              />
              {emailError && (
                <div className="validation-error">
                  <span className="error-icon">⚠</span>
                  {emailError}
                </div>
              )}
              <div className="input-hint">
                Debe ser un correo institucional UCI
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="required">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
              <div className="forgot-password">
                <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className={`auth-button ${loading ? 'loading' : ''}`} 
              disabled={loading || !!emailError}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <div className="auth-links">
              <p className="auth-link">
                ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};