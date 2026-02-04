import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../auth/Auth.css';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cargo: '',
    disciplina: '',
    faculty: '',
    carrera: '',
    asignatura:''
  });
  
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
    strength: 0 // 0-100%
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validación para nombre (no números)
const validateName = (name) => {
  const nameRegex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
  return nameRegex.test(name);
};

// Validación de fortaleza de contraseña
const checkPasswordStrength = (password) => {
  const checks = {
    hasMinLength: password.length >= 8,
    hasNumber: /\d/.test(password),                    // Al menos un número
    hasUppercase: /[A-Z]/.test(password),              // Al menos una mayúscula
    hasLowercase: /[a-z]/.test(password),              // Al menos una minúscula
    hasSpecialChar: /[^A-Za-z0-9]/.test(password)  // Cualquier cosa que no sea letra o número  .test(password) // Caracteres especiales
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const strength = (passedChecks / 5) * 100;

  return { ...checks, strength };
};
  // Validar email institucional
  const validateEmailDomain = (email) => {
    return email.endsWith('@uci.cu') || email.endsWith('usuario@uci.cu');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación en tiempo real para nombre
    if (name === 'name' && !validateName(value) && value !== '') {
      setErrors(prev => ({
        ...prev,
        [name]: 'El nombre no debe contener números ni caracteres especiales'
      }));
    } else if (name === 'name') {
      // Limpiar error si se corrige
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validación en tiempo real para email
    if (name === 'email' && value !== '' && !validateEmailDomain(value)) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Debe usar un correo institucional UCI (@uci.cu'
      }));
    } else if (name === 'email') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validación en tiempo real para contraseña
    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
      
      if (value.length > 0 && value.length < 8) {
        setErrors(prev => ({
          ...prev,
          [name]: 'La contraseña debe tener al menos 8 caracteres'
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }

    // Validación en tiempo real para confirmar contraseña
    if (name === 'confirmPassword' && formData.password !== value && value !== '') {
      setErrors(prev => ({
        ...prev,
        [name]: 'Las contraseñas no coinciden'
      }));
    } else if (name === 'confirmPassword' && formData.password === value) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Resetear errores
    const newErrors = {};

    // Validar nombre completo
    if (!validateName(formData.name)) {
      newErrors.name = 'El nombre no debe contener números ni caracteres especiales';
    }

    // Validar email institucional
    if (!validateEmailDomain(formData.email)) {
      newErrors.email = 'Debe usar un correo institucional UCI (@uci.edu.cu o @estudiantes.uci.edu.cu)';
    }

    // Validar campos obligatorios
    if (!formData.cargo) {
      newErrors.cargo = 'Debe seleccionar un cargo';
    }

    if (!formData.disciplina) {
      newErrors.disciplina = 'Debe seleccionar una disciplina';
    }

    if (!formData.faculty) {
      newErrors.faculty = 'Debe seleccionar una facultad';
    }

    if (!formData.carrera) {
      newErrors.carrera = 'Debe seleccionar una carrera';
    }
     if (!formData.asignatura) {
      newErrors.asignatura = 'Debe seleccionar una asignatura';
    }

    // Validar contraseña
    if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    const strength = checkPasswordStrength(formData.password);
    if (strength.strength < 80) {
      newErrors.password = 'La contraseña no cumple con los requisitos de seguridad';
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Si hay errores, mostrarlos y detener el envío
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Si todo está bien, proceder con el registro
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        disciplina: formData.disciplina,
        cargo: formData.cargo,
        faculty: formData.faculty,
        carrera: formData.carrera,
        asignatura: formData.asignatura
      });
      navigate('/dashboard');
    } catch (err) {
      setErrors({ general: err.message || 'Error al registrarse' });
    } finally {
      setLoading(false);
    }
  };

  // Determinar nivel de fortaleza
  const getStrengthLevel = () => {
    if (passwordStrength.strength < 40) return { text: 'Débil', color: '#dc2626' };
    if (passwordStrength.strength < 70) return { text: 'Moderada', color: '#f59e0b' };
    if (passwordStrength.strength < 90) return { text: 'Buena', color: '#99b843' };
    return { text: 'Excelente', color: '#16a34a' };
  };

  const strengthLevel = getStrengthLevel();

  return (
    <div className="auth-container register-page">
      {/* Panel lateral */}
      <div className="auth-sidebar">
        <div className="sidebar-content">
          <h1>Sistema de Gestión de Carga Docente</h1>
          <p>Crea tu cuenta con credenciales seguras para acceder al sistema de gestión académica.</p>
          <div className="uci-badge">
            <span>UCI - SEGURIDAD ACADÉMICA</span>
          </div>
        </div>
      </div>

      {/* Panel de formulario */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="form-header">
            <h2>Crear Cuenta</h2>
            <p>Completa el formulario con información válida y segura</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Nombre Completo */}
            <div className="form-group">
              <label htmlFor="name" className="required">Nombre Completo</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez Rodríguez"
                required
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && (
                <div className="validation-error">
                  <span className="error-icon">⚠</span>
                  {errors.name}
                </div>
              )}
              <div className="input-hint">
                Solo letras y espacios, sin números ni caracteres especiales
              </div>
            </div>

            {/* Correo Electrónico */}
            <div className="form-group">
              <label htmlFor="email" className="required">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="usuario@uci.cu"
                required
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && (
                <div className="validation-error">
                  <span className="error-icon">⚠</span>
                  {errors.email}
                </div>
              )}
              <div className="input-hint">
                Debe ser un correo institucional UCI
              </div>
            </div>

            {/* Cargo */}
            <div className="form-group">
              <label htmlFor="cargo" className="required">Cargo</label>
              <select
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                required 
                className={errors.cargo ? 'input-error' : ''}
              >
                <option value="">Selecciona un cargo</option>
                <option value="jefe de disciplina">Jefe de disciplina</option>
                <option value="jefe de departamento">Jefe de departamento</option>
                <option value="Vicedecano">Vicedecano</option>
                <option value="Director">Director</option>
              </select>
              {errors.cargo && (
                <div className="validation-error">
                  <span className="error-icon">⚠</span>
                  {errors.cargo}
                </div>
              )}
            </div>

            {/* Disciplina */}
            <div className="form-group">
              <label htmlFor="disciplina" className="required">Disciplina</label>
              <select
                id="disciplina"
                name="disciplina"
                value={formData.disciplina}
                onChange={handleChange}
                required
                className={errors.disciplina ? 'input-error' : ''}
              >
                <option value="">Selecciona una disciplina</option>
                <option value="Educación Física">Educación Física</option>
                <option value="Inteligencia Computacional">Inteligencia Computacional</option>
                <option value="Sistemas Digitales">Sistemas Digitales</option>
                <option value="Idioma Extranjero">Idioma Extranjero</option>
                <option value="Matemática">Matemática</option>
                <option value="Física">Física</option>
                <option value="Práctica Profesional">Práctica Profesional</option>
                <option value="Técnicas de Programación de Computadoras">Técnicas de Programación de Computadoras</option>
                <option value="Ingeniería y Gestión de Software">Ingeniería y Gestión de Software</option>
                <option value="Gestión Organizacional">Gestión Organizacional</option>
                <option value="Preparación para la Defensa">Preparación para la Defensa</option>
                <option value="Marxismo Leninismo">Marxismo Leninismo</option>
                <option value="Historia de Cuba">Historia de Cuba</option>
              </select>
              {errors.disciplina && (
                <div className="validation-error">
                  <span className="error-icon">⚠</span>
                  {errors.disciplina}
                </div>
              )}
            </div>

            {/* Carrera */}
            <div className="form-group">
              <label htmlFor="carrera" className="required">Carrera</label>
              <select
                id="carrera"
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
                required 
                className={errors.carrera ? 'input-error' : ''}
              >
                <option value="">Selecciona una carrera</option>
                <option value="Ciencias Informáticas">Ingeniería en Ciencias Informáticas</option>
                <option value="Bioinformática">Ingeniería en Bioinformática</option>
                <option value="Ciberseguridad">Ingeniería en Ciberseguridad</option>
              </select>
              {errors.carrera && (
                <div className="validation-error">
                  <span className="error-icon">⚠</span>
                  {errors.carrera}
                </div>
              )}
            </div>

            {/* Facultad */}
            <div className="form-group">
              <label htmlFor="faculty" className="required">Facultad</label>
              <select
                id="faculty"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                required 
                className={errors.faculty ? 'input-error' : ''}
              >
                <option value="">Selecciona una facultad</option>
                <option value="Tecnologías Libres">Facultad de Tecnologías Libres</option>
                <option value="Tecnologías Interactivas">Facultad de Tecnologías Interactivas</option>
                <option value="Tecnologías Educativas">Facultad de Tecnologías Educativas</option>
                <option value="Informática Organizacional">Facultad de Informática Organizacional</option>
                <option value="Ciencias y Tecnologías Computacionales">Facultad de Ciencias y Tecnologías Computacionales</option>
                <option value="Ciberseguridad">Facultad de Ciberseguridad</option>
              </select>
              {errors.faculty && (
                <div className="validation-error">
                  <span className="error-icon">⚠</span>
                  {errors.faculty}
                </div>
              )}
            </div>
          
           {/* Asignaturas */}
            <div className="form-group">
              <label htmlFor="asignatura" className="required">Asignatura</label>
              <select
                id="asignatura"
                name="asignatura"
                value={formData.asignatura}
                onChange={handleChange}
                required 
                className={errors.asignatura ? 'input-error' : ''}
              >
                <option value="">Selecciona una asignatura</option>
                <option value=" ICI1"> ICI1</option>
                <option value=" ICI2"> ICI2</option>
                <option value="PID1"> PID1</option>
                <option value=" PID2">PID2</option>
                <option value="PID3">PID3</option>
                <option value="PID4">PID4</option>
                <option value="PID5">PID5</option>
                <option value="MIC">MIC</option>
                <option value="IP1">IP1</option>
                <option value="IP2">IP2</option>
                <option value="ED1">ED1</option>
                <option value="ED2">ED2</option>
                <option value="Pweb">Pweb</option>
                <option value="SBD1"> SBD1</option>
                <option value=" SBD2">SBD2</option>
                <option value="ISW1">ISW1</option>
                <option value="ISW2">ISW2</option>
                <option value="GPI">GPI</option>
                <option value="Filosofía">Filosofía</option>
                <option value="EP">EP</option>
                <option value="TP">TP</option>
                <option value="ECTS">ECTS</option>
                <option value="Historia de Cuba">Historia de Cuba</option>
                <option value="MD1">MD1</option>
                <option value="MD2">MD2</option>
                <option value="PE">PE</option>
                <option value="IO">IO</option>
                <option value="IA">IA</option>
                <option value="AA">AA</option>
                <option value="FAGO">FAGO</option>
                <option value="GPN">GPN</option>
                <option value="AC">AC</option>
                <option value="SO">SO</option>
                <option value="RSI1">ISW1</option>
                <option value="RSI2">RSI2</option>
                <option value="Álgebra">Álgebra</option> 
                <option value="M1">M1</option>
                <option value="M2">M2</option>
                <option value="M3">M3</option>
                <option value="Física">Física</option>
                <option value="EF1">EF1</option>
                <option value="EF2">EF2</option>
                <option value="EF3">EF3</option>
                <option value="EF4">EF4</option>
                                 
              </select>
              {errors.asignatura && (
                <div className="validation-error">
                  <span className="error-icon">⚠</span>
                  {errors.asignatura}
                </div>
              )}
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label htmlFor="password" className="required">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres con mayúsculas, números y símbolos"
                required
                className={errors.password ? 'input-error' : ''}
              />
              
              {/* Indicador de fortaleza */}
              {formData.password && (
                <div className="password-strength-container">
                  <div className="strength-meter">
                    <div 
                      className="strength-bar"
                      style={{ 
                        width: `${passwordStrength.strength}%`,
                        backgroundColor: strengthLevel.color
                      }}
                    ></div>
                  </div>
                  <div className="strength-info">
                    <span className="strength-text">
                      Fortaleza: <strong style={{ color: strengthLevel.color }}>
                        {strengthLevel.text}
                      </strong>
                    </span>
                    <span className="strength-percentage">
                      {Math.round(passwordStrength.strength)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Requisitos de contraseña */}
              {formData.password && (
                <div className="password-requirements">
                  <h4>La contraseña debe incluir:</h4>
                  <ul>
                    <li className={passwordStrength.hasMinLength ? 'valid' : 'invalid'}>
                      {passwordStrength.hasMinLength ? '✓' : '✗'} Mínimo 8 caracteres
                    </li>
                    <li className={passwordStrength.hasUppercase ? 'valid' : 'invalid'}>
                      {passwordStrength.hasUppercase ? '✓' : '✗'} Al menos una mayúscula
                    </li>
                    <li className={passwordStrength.hasLowercase ? 'valid' : 'invalid'}>
                      {passwordStrength.hasLowercase ? '✓' : '✗'} Al menos una minúscula
                    </li>
                    <li className={passwordStrength.hasNumber ? 'valid' : 'invalid'}>
                      {passwordStrength.hasNumber ? '✓' : '✗'} Al menos un número
                    </li>
                    <li className={passwordStrength.hasSpecialChar ? 'valid' : 'invalid'}>
                      {passwordStrength.hasSpecialChar ? '✓' : '✗'} Al menos un carácter especial (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              )}

              {errors.password && (
                <div className="validation-error">
                  <span className="error-icon">⚠</span>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="required">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              {errors.confirmPassword && (
                <div className="validation-error">
                  <span className="error-icon">⚠</span>
                  {errors.confirmPassword}
                </div>
              )}
              {formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword && (
                <div className="validation-success">
                  <span className="success-icon">✓</span>
                  Las contraseñas coinciden
                </div>
              )}
            </div>

            {/* Error general */}
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            <button 
              type="submit" 
              className={`auth-button register ${loading ? 'loading' : ''}`} 
              disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>

            <div className="auth-links">
              <p className="auth-link">
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};