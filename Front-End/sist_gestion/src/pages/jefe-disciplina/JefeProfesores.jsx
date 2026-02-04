import React from 'react';
import { MainLayout } from '../../components/common/Layout';
import { Table } from '../../components/common/Table';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

export const JefeProfesores = () => {
  const { professors } = useData();

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
          <h1 className="page-title">Profesores</h1>
          <p className="page-subtitle">Listado de profesores de la unidad</p>
        </div>
      </div>

      <div className="section">
        <Table columns={columns} data={professors} />
      </div>
    </MainLayout>
  );
};

export default JefeProfesores;
