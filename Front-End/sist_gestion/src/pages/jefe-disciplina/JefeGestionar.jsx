import React, { useState } from 'react';
import { MainLayout } from '../../components/common/Layout';
import { Table } from '../../components/common/Table';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import './Dashboard.css';

export const JefeGestionar = () => {
  const { professors, deleteProfessor } = useData();
  const { showSuccess, showInfo, confirm } = useNotification();

  const handleDelete = (id) => {
    confirm(
      {
        title: 'Eliminar profesor',
        message: '¿Estás seguro de que deseas eliminar este profesor?',
        type: 'danger',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
      (confirmed) => {
        if (confirmed) {
          deleteProfessor(id);
          showSuccess('Profesor eliminado');
        }
      }
    );
  };

  const handleEdit = (prof) => {
    showInfo('Editar profesor — usa el botón + Agregar Profesor en el dashboard para crear/editar.');
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
    { id: 'professors', icon: '👨‍🏫', label: 'Ver Profesores', href: '/jefe/profesores' },
    { id: 'manage', icon: '✏️', label: 'Gestionar Profesores', href: '/jefe/gestionar' },
    { id: 'messages', icon: '💬', label: 'Mensajes', href: '/jefe/mensajes' },
  ];

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestionar Profesores</h1>
          <p className="page-subtitle">Editar o eliminar profesores de la unidad</p>
        </div>
      </div>

      <div className="section">
        <Table columns={columns} data={professors} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </MainLayout>
  );
};

export default JefeGestionar;
