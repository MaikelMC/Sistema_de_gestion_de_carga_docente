import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/common/Layout';
import { Table, Modal } from '../../components/common/Table';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

export const JefeDisciplinaDashboard = () => {
  const { professors, addProfessor, updateProfessor, deleteProfessor, addComment } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    asignatura: '',
    faculty: '',
    carrera: ''
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'manage', icon: '👥', label: 'Gestión de Profesores', href: '/jefe/gestion' },
    { id: 'messages', icon: '💬', label: 'Mensajes', href: '/jefe/mensajes' },
  ];

  // Validación en tiempo real
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors[name] = 'El nombre es obligatorio';
        } else if (value.length < 3) {
          newErrors[name] = 'Mínimo 3 caracteres';
        } else {
          delete newErrors[name];
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          newErrors[name] = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[name] = 'Email inválido';
        } else {
          delete newErrors[name];
        }
        break;
      
      case 'faculty':
      case 'department':
      case 'asignatura':
        if (!value.trim()) {
          newErrors[name] = 'Este campo es obligatorio';
        } else {
          delete newErrors[name];
        }
        break;
      
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  // Validar mensaje por separado
  const validateMessage = (value) => {
    const newErrors = { ...errors };
    
    if (!value.trim()) {
      newErrors.message = 'El mensaje es obligatorio';
    } else if (value.length < 10) {
      newErrors.message = 'Mínimo 10 caracteres';
    } else {
      delete newErrors.message;
    }
    
    setErrors(newErrors);
  };

  // Validación completa del formulario
  const validateForm = () => {
    const requiredFields = ['name', 'email', 'department', 'faculty', 'asignatura'];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'Este campo es obligatorio';
      }
    });
    
    // Validar email específicamente
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validar mensaje
    if (!messageText.trim()) {
      newErrors.message = 'El mensaje es obligatorio';
    } else if (messageText.length < 10) {
      newErrors.message = 'Mínimo 10 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mostrar toast (alert mejorado)
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleAddProfessor = () => {
    setEditingProf(null);
    setFormData({ 
      name: '', 
      email: '', 
      department: '', 
      asignatura: '', 
      faculty: '', 
      carrera: '' 
    });
    setMessageText('');
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (prof) => {
    setEditingProf(prof);
    setFormData({
      name: prof.name || '',
      email: prof.email || '',
      department: prof.department || '',
      asignatura: prof.asignatura || prof.subjects?.[0] || '',
      faculty: prof.faculty || '',
      carrera: prof.carrera || ''
    });
    setMessageText('');
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      deleteProfessor(id);
      showToast('Profesor eliminado exitosamente', 'success');
    }
  };

  const handleSaveProfessor = () => {
    if (!validateForm()) {
      showToast('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    const professorData = {
      ...formData,
      subjects: formData.asignatura ? [formData.asignatura] : []
    };

    try {
      if (editingProf) {
        updateProfessor(editingProf.id, professorData);
        showToast('Profesor actualizado exitosamente', 'success');
      } else {
        addProfessor(professorData);
        showToast('Profesor agregado exitosamente', 'success');
      }

      // Agregar comentario
      addComment({
        author: 'Jefe de Disciplina ' + formData.department,
        message: messageText,
        type: editingProf ? 'edit' : 'add'
      });

      setIsModalOpen(false);
      setMessageText('');
      setErrors({});
    } catch (error) {
      showToast('Error al guardar el profesor: ' + error.message, 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessageText(value);
    validateMessage(value);
  };

  const handleMessageBlur = (e) => {
    validateMessage(e.target.value);
  };

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Disciplina' },
    { key: 'subjects', label: 'Asignaturas', render: (row) => row.subjects?.join(', ') || row.asignatura || 'N/A' },
    { key: 'faculty', label: 'Facultad' },
    { key: 'carrera', label: 'Carrera' },
  ];

  // Efecto para cerrar toast automáticamente
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <MainLayout sidebarItems={sidebarItems}>
      {/* Toast/Notificación flotante - DELANTE de todo */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
          <button 
            className="toast-close" 
            onClick={() => setToast(null)}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Carga Docente</h1>
          <p className="page-subtitle">Administra los profesores de tu disciplina</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleAddProfessor}>
            + Agregar Profesor
          </button>
        </div>
      </div>

      <div className="admin-grid">
        <div className="stats-card">
          <div className="stat-number">{professors.length}</div>
          <div className="stat-label">Total de Profesores</div>
        </div>
        <div className="stats-card">
          <div className="stat-number">
            {[...new Set(professors.flatMap(p => p.subjects || (p.asignatura ? [p.asignatura] : [])))].length}
          </div>
          <div className="stat-label">Asignaturas Asignadas</div>
        </div>
      </div>

      <div className="section">
        <h2>Listado de Profesores Registrados</h2>
        <Table
          columns={columns}
          data={professors}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        title={editingProf ? 'Editar Profesor' : 'Agregar Nuevo Profesor'}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSaveProfessor}
        confirmText={editingProf ? 'Actualizar' : 'Agregar'}
        confirmDisabled={Object.keys(errors).length > 0}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSaveProfessor(); }}>
          <div className="form-group">
            <label htmlFor="name">Nombre Completo*</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={(e) => validateField('name', e.target.value)}
              placeholder="Juan García"
              className={errors.name ? 'input-error' : ''}
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <div id="name-error" className="validation-error" role="alert">
                <span className="error-icon">⚠</span>
                {errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico*</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={(e) => validateField('email', e.target.value)}
              placeholder="juan@uci.cu"
              className={errors.email ? 'input-error' : ''}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <div id="email-error" className="validation-error" role="alert">
                <span className="error-icon">⚠</span>
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="department">Disciplina*</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              onBlur={(e) => validateField('department', e.target.value)}
              className={errors.department ? 'input-error' : ''}
              aria-describedby={errors.department ? 'department-error' : undefined}
              aria-invalid={!!errors.department}
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
            {errors.department && (
              <div id="department-error" className="validation-error" role="alert">
                <span className="error-icon">⚠</span>
                {errors.department}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="asignatura">Asignatura*</label>
            <select
              id="asignatura"
              name="asignatura"
              value={formData.asignatura}
              onChange={handleInputChange}
              onBlur={(e) => validateField('asignatura', e.target.value)}
              className={errors.asignatura ? 'input-error' : ''}
              aria-describedby={errors.asignatura ? 'asignatura-error' : undefined}
              aria-invalid={!!errors.asignatura}
            >
              <option value="">Seleccionar una asignatura</option>
              <option value="ICI1">ICI1</option>
              <option value="ICI2">ICI2</option>
              <option value="PID1">PID1</option>
              <option value="PID2">PID2</option>
              <option value="PID3">PID3</option>
              <option value="PID4">PID4</option>
              <option value="PID5">PID5</option>
              <option value="MIC">MIC</option>
              <option value="IP1">IP1</option>
              <option value="IP2">IP2</option>
              <option value="ED1">ED1</option>
              <option value="ED2">ED2</option>
              <option value="Pweb">Pweb</option>
              <option value="SBD1">SBD1</option>
              <option value="SBD2">SBD2</option>
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
              <option value="RSI1">RSI1</option>
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
              <div id="asignatura-error" className="validation-error" role="alert">
                <span className="error-icon">⚠</span>
                {errors.asignatura}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="faculty">Facultad*</label>
            <select
              id="faculty"
              name="faculty"
              value={formData.faculty}
              onChange={handleInputChange}
              onBlur={(e) => validateField('faculty', e.target.value)}
              className={errors.faculty ? 'input-error' : ''}
              aria-describedby={errors.faculty ? 'faculty-error' : undefined}
              aria-invalid={!!errors.faculty}
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
              <div id="faculty-error" className="validation-error" role="alert">
                <span className="error-icon">⚠</span>
                {errors.faculty}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="carrera">Carrera</label>
            <input
              id="carrera"
              name="carrera"
              type="text"
              value={formData.carrera}
              onChange={handleInputChange}
              placeholder="Ingeniería en Ciencias Informáticas"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje de Cambio (Obligatorio)*</label>
            <textarea
              id="message"
              name="message"
              value={messageText}
              onChange={handleMessageChange}
              onBlur={handleMessageBlur}
              placeholder="Describe el motivo de esta operación..."
              rows="4"
              className={errors.message ? 'input-error' : ''}
              aria-describedby={errors.message ? 'message-error' : undefined}
              aria-invalid={!!errors.message}
            />
            {errors.message && (
              <div id="message-error" className="validation-error" role="alert">
                <span className="error-icon">⚠</span>
                {errors.message}
              </div>
            )}
          </div>

          <div className="form-required-note">
            <span className="required-marker">*</span> Campos obligatorios
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};