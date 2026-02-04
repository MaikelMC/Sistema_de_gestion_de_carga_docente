import React, { useState, useMemo } from 'react';
import { MainLayout } from '../../components/common/Layout';
import { Table, Alert, Modal } from '../../components/common/Table';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

export const VicedecanoGestion = () => {
  const { professors, disciplines, deleteProfessor, updateProfessor, addProfessor, addComment } = useData();
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDisciplina, setFilterDisciplina] = useState('');
  const [filterFacultad, setFilterFacultad] = useState('');
  const [editingProf, setEditingProf] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    department: '',
    subjects: [],
    faculty: ''
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    department: 'Programación',
    subjects: [],
    faculty: ''
  });
  const [messageText, setMessageText] = useState('');

  // Obtener disciplinas y facultades únicas
  const disciplinas = useMemo(() => [...new Set(professors.map(p => p.department))], [professors]);
  const facultades = useMemo(() => [...new Set(professors.map(p => p.faculty))], [professors]);

  // Filtrar profesores
  const filteredProfessors = useMemo(() => {
    return professors.filter(prof => {
      const matchSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDisciplina = !filterDisciplina || prof.department === filterDisciplina;
      const matchFacultad = !filterFacultad || prof.faculty === filterFacultad;
      return matchSearch && matchDisciplina && matchFacultad;
    });
  }, [professors, searchTerm, filterDisciplina, filterFacultad]);

  const handleAddClick = () => {
    setAddFormData({
      name: '',
      email: '',
      department: 'Programación',
      subjects: [],
      faculty: ''
    });
    setMessageText('');
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = () => {
    if (!addFormData.name || !addFormData.email || !messageText) {
      setAlert({ type: 'error', message: 'Completa todos los campos incluyendo el mensaje' });
      return;
    }

    addProfessor(addFormData);
    addComment({
      author: 'Vicedecano de Formación',
      message: messageText,
      type: 'add'
    });

    setAlert({ type: 'success', message: 'Profesor agregado exitosamente' });
    setIsAddModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      deleteProfessor(id);
      setAlert({ type: 'success', message: 'Profesor eliminado exitosamente' });
    }
  };

  const handleEditClick = (prof) => {
    setEditingProf(prof);
    setEditFormData(prof);
    setMessageText('');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editFormData.name || !editFormData.email || !messageText) {
      setAlert({ type: 'error', message: 'Completa todos los campos incluyendo el mensaje' });
      return;
    }

    updateProfessor(editingProf.id, editFormData);
    addComment({
      author: 'Vicedecano de Formación',
      message: messageText,
      type: 'edit'
    });

    setAlert({ type: 'success', message: 'Profesor actualizado exitosamente' });
    setIsEditModalOpen(false);
    setEditingProf(null);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterDisciplina('');
    setFilterFacultad('');
  };

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Disciplina' },
    { key: 'subjects', label: 'Asignaturas', render: (row) => row.subjects.join(', ') },
    { key: 'faculty', label: 'Facultad' },
  ];

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'manage', icon: '👥', label: 'Gestión de Profesores', href: '/vicedecano/gestion' },
    { id: 'reports', icon: '📋', label: 'Reportes', href: '/vicedecano/reportes' },
    { id: 'messages', icon: '💬', label: 'Mensajes', href: '/vicedecano/mensajes' },
  ];

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Profesores</h1>
          <p className="page-subtitle">Visualiza, busca, edita y elimina profesores de todas las disciplinas y facultades</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleAddClick}>
            + Agregar Profesor
          </button>
        </div>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="search">Buscar por nombre o email:</label>
          <input
            id="search"
            type="text"
            placeholder="Ej: Juan García, juan@uci.edu.cu"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="disciplina">Disciplina:</label>
          <select
            id="disciplina"
            value={filterDisciplina}
            onChange={(e) => setFilterDisciplina(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas</option>
            {disciplinas.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="facultad">Facultad:</label>
          <select
            id="facultad"
            value={filterFacultad}
            onChange={(e) => setFilterFacultad(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas</option>
            {facultades.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <button className="btn-clear-filters" onClick={handleClearFilters}>
          Limpiar Filtros
        </button>
      </div>

      {/* Estadísticas de resultados */}
      <div className="results-info">
        <span>Mostrando <strong>{filteredProfessors.length}</strong> de <strong>{professors.length}</strong> profesores</span>
      </div>

      {/* Tabla */}
      <div className="section">
        <Table
          columns={columns}
          data={filteredProfessors}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal para agregar */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Agregar Nuevo Profesor</h2>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Nombre Completo*</label>
                <input
                  type="text"
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  placeholder="Dr. Juan García"
                />
              </div>

              <div className="form-group">
                <label>Correo Electrónico*</label>
                <input
                  type="email"
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  placeholder="juan@uci.edu.cu"
                />
              </div>

              <div className="form-group">
                <label>Disciplina*</label>
                <select
                  value={addFormData.department}
                  onChange={(e) => setAddFormData({ ...addFormData, department: e.target.value })}
                >
                  <option value="Programación">Programación</option>
                  <option value="Base de Datos">Base de Datos</option>
                  <option value="Sistemas">Sistemas</option>
                  <option value="Redes">Redes</option>
                </select>
              </div>

              <div className="form-group">
                <label>Asignaturas (separadas por coma)*</label>
                <input
                  type="text"
                  value={addFormData.subjects.join(', ')}
                  onChange={(e) => setAddFormData({
                    ...addFormData,
                    subjects: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                  placeholder="Python, Programación Web"
                />
              </div>

              <div className="form-group">
                <label>Facultad*</label>
                <input
                  type="text"
                  value={addFormData.faculty}
                  onChange={(e) => setAddFormData({ ...addFormData, faculty: e.target.value })}
                  placeholder="Ingeniería Informática"
                />
              </div>

              <div className="form-group">
                <label>Mensaje de Cambio (Obligatorio)*</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Describe el motivo de esta operación..."
                  rows="4"
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSaveAdd}>
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Editar Profesor</h2>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Nombre Completo*</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  placeholder="Dr. Juan García"
                />
              </div>

              <div className="form-group">
                <label>Correo Electrónico*</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  placeholder="juan@uci.edu.cu"
                />
              </div>

              <div className="form-group">
                <label>Disciplina*</label>
                <select
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                >
                  <option value="">Selecciona una disciplina</option>
                  <option value="Programación">Programación</option>
                  <option value="Base de Datos">Base de Datos</option>
                  <option value="Sistemas">Sistemas</option>
                  <option value="Redes">Redes</option>
                </select>
              </div>

              <div className="form-group">
                <label>Asignaturas (separadas por coma)*</label>
                <input
                  type="text"
                  value={editFormData.subjects.join(', ')}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    subjects: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                  placeholder="Python, Programación Web"
                />
              </div>

              <div className="form-group">
                <label>Facultad*</label>
                <input
                  type="text"
                  value={editFormData.faculty}
                  onChange={(e) => setEditFormData({ ...editFormData, faculty: e.target.value })}
                  placeholder="Ingeniería Informática"
                />
              </div>

              <div className="form-group">
                <label>Mensaje de Cambio (Obligatorio)*</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Describe el motivo de esta operación..."
                  rows="4"
                  style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '6px', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default VicedecanoGestion;
