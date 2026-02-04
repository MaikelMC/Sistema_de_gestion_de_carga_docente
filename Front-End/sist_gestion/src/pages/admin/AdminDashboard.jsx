import React from 'react';
import { MainLayout } from '../../components/common/Layout';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

export const AdminDashboard = () => {
  const { professors, disciplines, comments } = useData();

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'usuarios', icon: '👥', label: 'Gestionar Usuarios', href: '/admin/usuarios' },
    { id: 'roles', icon: '🔑', label: 'Roles y Permisos', href: '/admin/roles' },
    { id: 'cambios', icon: '🔐', label: 'Registro de Cambios', href: '/admin/cambios' },
  ];

  const facultades = [...new Set(professors.map(p => p.faculty))];

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Panel Administrativo</h1>
          <p className="page-subtitle">Gestiona usuarios, roles y permisos del sistema</p>
        </div>
      </div>

      <div className="admin-grid">
        <div className="stats-card">
          <div className="stat-number">{professors.length}</div>
          <div className="stat-label">Profesores</div>
        </div>
        <div className="stats-card">
          <div className="stat-number">{disciplines.length}</div>
          <div className="stat-label">Disciplinas</div>
        </div>
        <div className="stats-card">
          <div className="stat-number">{facultades.length}</div>
          <div className="stat-label">Facultades</div>
        </div>
        <div className="stats-card">
          <div className="stat-number">{comments.length}</div>
          <div className="stat-label">Cambios Registrados</div>
        </div>
      </div>

      <div className="section">
        <h2>Acceso Rápido</h2>
        <div className="quick-access-grid">
          <a href="/admin/usuarios" className="quick-access-card">
            <div className="quick-access-icon">👥</div>
            <div className="quick-access-title">Gestionar Usuarios</div>
            <div className="quick-access-desc">Crear, editar y eliminar usuarios</div>
          </a>
          <a href="/admin/roles" className="quick-access-card">
            <div className="quick-access-icon">🔑</div>
            <div className="quick-access-title">Roles y Permisos</div>
            <div className="quick-access-desc">Configurar permisos por rol</div>
          </a>
          <a href="/admin/cambios" className="quick-access-card">
            <div className="quick-access-icon">📋</div>
            <div className="quick-access-title">Registro de Cambios</div>
            <div className="quick-access-desc">Historial de actividades</div>
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
