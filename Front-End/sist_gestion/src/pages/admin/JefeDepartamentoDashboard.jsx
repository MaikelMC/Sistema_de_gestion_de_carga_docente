import React, { useState } from 'react';
import { MainLayout } from '../../components/common/Layout';
import { Table, Modal, Alert } from '../../components/common/Table';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

export const JefeDepartamentoDashboard = () => {
  const { professors, addProfessor, updateProfessor, deleteProfessor, addComment } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Programación',
    subjects: [],
    faculty: ''
  });

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'professors', icon: '👨‍🏫', label: 'Ver Profesores', href: '/jefe/profesores' },
    { id: 'manage', icon: '✏️', label: 'Gestionar Profesores', href: '/jefe/gestionar' },
    { id: 'messages', icon: '💬', label: 'Mensajes', href: '/jefe/mensajes' },
  ];

  const handleAddProfessor = () => {
    setEditingProf(null);
    setFormData({ name: '', email: '', department: 'Programación', subjects: [], faculty: '' });
    setShowMessageForm(true);
    setIsModalOpen(true);
  };

  const handleEdit = (prof) => {
    setEditingProf(prof);
    setFormData(prof);
    setShowMessageForm(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      deleteProfessor(id);
      setAlert({ type: 'success', message: 'Profesor eliminado exitosamente' });
    }
  };

  const handleSaveProfessor = () => {
    if (!formData.name || !formData.email || !messageText) {
      setAlert({ type: 'error', message: 'Completa todos los campos incluyendo el mensaje' });
      return;
    }

    if (editingProf) {
      updateProfessor(editingProf.id, formData);
      setAlert({ type: 'success', message: 'Profesor actualizado' });
    } else {
      addProfessor(formData);
      setAlert({ type: 'success', message: 'Profesor agregado' });
    }

    addComment({
      author: 'Jefe de Departamento ' + formData.department,
      message: messageText,
      type: editingProf ? 'edit' : 'add'
    });

    setIsModalOpen(false);
    setMessageText('');
  };

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Departamento' },
    { key: 'subjects', label: 'Asignaturas', render: (row) => row.subjects.join(', ') },
    { key: 'faculty', label: 'Facultad' },
  ];

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Carga Docente</h1>
          <p className="page-subtitle">Administra los profesores del departamento</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleAddProfessor}>
            + Agregar Profesor
          </button>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="admin-grid">
        <div className="stats-card">
          <div className="stat-number">{professors.length}</div>
          <div className="stat-label">Total de Profesores</div>
        </div>
        <div className="stats-card">
          <div className="stat-number">{[...new Set(professors.flatMap(p => p.subjects))].length}</div>
          <div className="stat-label">Asignaturas Asignadas</div>
        </div>
        <div className="stats-card">
          <div className="stat-number">{[...new Set(professors.map(p => p.faculty))].length}</div>
          <div className="stat-label">Facultades Cubiertas</div>
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
      >
        <div className="form-group">
          <label>Nombre Completo*</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Dr. Juan García"
          />
        </div>

        <div className="form-group">
          <label>Correo Electrónico*</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="juan@uci.edu.cu"
          />
        </div>

        <div className="form-group">
          <label>Departamento*</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
            value={formData.subjects.join(', ')}
            onChange={(e) => setFormData({
              ...formData,
              subjects: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            })}
            placeholder="Python, Programación Web"
          />
        </div>

        <div className="form-group">
          <label>Facultad*</label>
          <input
            type="text"
            value={formData.faculty}
            onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
            placeholder="Ingeniería Informática"
          />
        </div>

        {showMessageForm && (
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
        )}
      </Modal>
    </MainLayout>
  );
};
