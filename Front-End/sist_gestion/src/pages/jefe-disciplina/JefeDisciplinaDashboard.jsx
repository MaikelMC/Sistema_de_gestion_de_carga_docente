import React, { useState, useEffect, useRef } from 'react';
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
    asignaturas: [],
    faculty: '',
    carrera: ''
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [showAsignaturasDropdown, setShowAsignaturasDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'manage', icon: '👥', label: 'Gestión de Profesores', href: '/jefe/gestion' },
    { id: 'messages', icon: '💬', label: 'Mensajes', href: '/jefe/mensajes' },
  ];
    
  // Opciones de asignaturas organizadas por categorías
  const asignaturasOptions = [
    { category: 'Práctica Profesional', items: ['ICI1', 'ICI2', 'PID1', 'PID2', 'PID3', 'PID4', 'PID5', 'MIC'] },
    { category: ' Técnicas de Programación de Computadoras', items: ['IP1', 'IP2', 'ED1', 'ED2', 'Pweb'] },
    { category: ' Ingeniería y Gestión de Software', items: ['SBD1', 'SBD2', 'ISW1', 'ISW2', 'GPI'] },
    { category: 'Marxismo Leninismo', items: ['Filosofía', 'EP', 'TP', 'ECTS'] },
    { category: 'Historia de Cuba', items: ['Historia de Cuba'] },
    { category: 'Inteligencia Compuacional', items: ['MD1', 'MD2', 'PE', 'IO', 'IA', 'AA'] },
    { category: ' Gestión Organizacional', items: ['FAGO', 'GPN'] },
    { category: ' Sistemas Digitales', items: ['AC', 'SO', 'RSI1', 'RSI2'] },
    { category: 'Matemática', items: ['Álgebra', 'M1', 'M2', 'M3'] },
    { category: 'Física', items: ['Física'] },
    { category: 'Educación Física', items: ['EF1', 'EF2', 'EF3', 'EF4'] }
  ];

  // Todas las asignaturas en un array plano para el select múltiple original (backup)
   
  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAsignaturasDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        if (!value.trim()) {
          newErrors[name] = 'Este campo es obligatorio';
        } else {
          delete newErrors[name];
        }
        break;
      
      case 'asignaturas':
        if (!value || value.length === 0) {
          newErrors[name] = 'Selecciona al menos una asignatura';
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
    const requiredFields = ['name', 'email', 'department', 'faculty', 'asignaturas'];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (field === 'asignaturas') {
        if (!formData[field] || formData[field].length === 0) {
          newErrors[field] = 'Selecciona al menos una asignatura';
        }
      } else if (!formData[field]?.trim()) {
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

  // Manejar toggle de asignaturas
  const toggleAsignatura = (asignatura) => {
    const currentAsignaturas = [...formData.asignaturas];
    const index = currentAsignaturas.indexOf(asignatura);
    
    if (index === -1) {
      // Agregar
      currentAsignaturas.push(asignatura);
    } else {
      // Remover
      currentAsignaturas.splice(index, 1);
    }
    
    setFormData(prev => ({
      ...prev,
      asignaturas: currentAsignaturas
    }));
    
    validateField('asignaturas', currentAsignaturas);
  };

  // Seleccionar/deseleccionar todas las asignaturas de una categoría
  const toggleCategory = (categoryItems) => {
    const currentAsignaturas = [...formData.asignaturas];
    const allSelected = categoryItems.every(item => currentAsignaturas.includes(item));
    
    let newAsignaturas;
    if (allSelected) {
      // Deseleccionar todas
      newAsignaturas = currentAsignaturas.filter(item => !categoryItems.includes(item));
    } else {
      // Agregar las faltantes
      newAsignaturas = [...new Set([...currentAsignaturas, ...categoryItems])];
    }
    
    setFormData(prev => ({
      ...prev,
      asignaturas: newAsignaturas
    }));
    
    validateField('asignaturas', newAsignaturas);
  };

  const handleAddProfessor = () => {
    setEditingProf(null);
    setFormData({ 
      name: '', 
      email: '', 
      department: '', 
      asignaturas: [], 
      faculty: '', 
      carrera: '' 
    });
    setMessageText('');
    setErrors({});
    setShowAsignaturasDropdown(false);
    setIsModalOpen(true);
  };

  const handleEdit = (prof) => {
    setEditingProf(prof);
    setFormData({
      name: prof.name || '',
      email: prof.email || '',
      department: prof.department || '',
      asignaturas: prof.asignaturas || prof.subjects || [],
      faculty: prof.faculty || '',
      carrera: prof.carrera || ''
    });
    setMessageText('');
    setErrors({});
    setShowAsignaturasDropdown(false);
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
      subjects: formData.asignaturas
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
      setShowAsignaturasDropdown(false);
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
    
    if (name !== 'asignaturas') {
      validateField(name, value);
    }
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
    { 
      key: 'subjects', 
      label: 'Asignaturas', 
      render: (row) => row.subjects?.join(', ') || row.asignaturas?.join(', ') || 'N/A' 
    },
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
      {/* Toast/Notificación flotante */}
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
            {[...new Set(professors.flatMap(p => p.subjects || p.asignaturas || []))].length}
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

          {/* NUEVO: Multi-select con dropdown */}
          <div className="form-group" ref={dropdownRef}>
            <label htmlFor="asignaturas">Asignaturas*</label>
            <div className="multi-select-container">
              <div 
                className={`multi-select-trigger ${errors.asignaturas ? 'input-error' : ''} ${showAsignaturasDropdown ? 'active' : ''}`}
                onClick={() => setShowAsignaturasDropdown(!showAsignaturasDropdown)}
                aria-expanded={showAsignaturasDropdown}
                aria-describedby={errors.asignaturas ? 'asignaturas-error' : undefined}
                aria-invalid={!!errors.asignaturas}
              >
                <div className="selected-items">
                  {formData.asignaturas.length > 0 ? (
                    <span className="selected-count-badge">
                      {formData.asignaturas.length} asignatura(s) seleccionada(s)
                    </span>
                  ) : (
                    <span className="placeholder">Selecciona asignaturas...</span>
                  )}
                </div>
                <span className="dropdown-arrow">▼</span>
              </div>
              
              {showAsignaturasDropdown && (
                <div className="multi-select-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-title">Selecciona las asignaturas</span>
                    <button 
                      type="button"
                      className="clear-all-btn"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, asignaturas: [] }));
                        validateField('asignaturas', []);
                      }}
                    >
                      Limpiar todo
                    </button>
                  </div>
                  
                  <div className="dropdown-search">
                    <input
                      type="text"
                      placeholder="Buscar asignaturas..."
                      className="search-input"
                      id="search-asignaturas"
                    />
                  </div>
                  
                  <div className="dropdown-content">
                    {asignaturasOptions.map((category, index) => (
                      <div key={index} className="category-section">
                        <div className="category-header">
                          <span className="category-title">{category.category}</span>
                          <button
                            type="button"
                            className="category-toggle"
                            onClick={() => toggleCategory(category.items)}
                          >
                            {category.items.every(item => formData.asignaturas.includes(item)) 
                              ? 'Deseleccionar todas' 
                              : 'Seleccionar todas'}
                          </button>
                        </div>
                        <div className="category-items">
                          {category.items.map((asignatura) => (
                            <label key={asignatura} className="checkbox-item">
                              <input
                                type="checkbox"
                                checked={formData.asignaturas.includes(asignatura)}
                                onChange={() => toggleAsignatura(asignatura)}
                                className="checkbox-input"
                              />
                              <span className="checkbox-custom"></span>
                              <span className="checkbox-label">{asignatura}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="dropdown-footer">
                    <span className="selected-total">
                      Seleccionadas: <strong>{formData.asignaturas.length}</strong>
                    </span>
                    <button
                      type="button"
                      className="done-btn"
                      onClick={() => setShowAsignaturasDropdown(false)}
                    >
                      Listo
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {formData.asignaturas.length > 0 && (
              <div className="selected-pills">
                {formData.asignaturas.slice(0, 3).map((asignatura) => (
                  <span key={asignatura} className="selected-pill">
                    {asignatura}
                    <button
                      type="button"
                      className="pill-remove"
                      onClick={() => toggleAsignatura(asignatura)}
                      aria-label={`Remover ${asignatura}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {formData.asignaturas.length > 3 && (
                  <span className="pill-more">
                    +{formData.asignaturas.length - 3} más
                  </span>
                )}
              </div>
            )}
            
            {errors.asignaturas && (
              <div id="asignaturas-error" className="validation-error" role="alert">
                <span className="error-icon">⚠</span>
                {errors.asignaturas}
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
            <select
             id="carrera"
              name="carrera"
              value={formData.carrera}
              onChange={handleInputChange}
              onBlur={(e) => validateField('carrera', e.target.value)}
              className={errors.carrera ? 'input-error' : ''}
              aria-describedby={errors.carrera ? 'carrera-error' : undefined}
              aria-invalid={!!errors.carrera}
            >
               <option value="">Selecciona una carrera</option>
                <option value="Ciencias Informáticas">Ingeniería en Ciencias Informáticas</option>
                <option value="Bioinformática">Ingeniería en Bioinformática</option>
                <option value="Ciberseguridad">Ingeniería en Ciberseguridad</option>
             </select>
              {errors.carrera && (
              <div id="carrera-error" className="validation-error" role="alert">
                <span className="error-icon">⚠</span>
                {errors.carrera}  
                 </div>
              )}
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