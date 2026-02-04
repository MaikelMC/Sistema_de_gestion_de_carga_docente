import React from 'react';
import { MainLayout } from '../../components/common/Layout';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

export const AdminCambios = () => {
  const { comments } = useData();

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'usuarios', icon: '👥', label: 'Gestionar Usuarios', href: '/admin/usuarios' },
    { id: 'roles', icon: '🔑', label: 'Roles y Permisos', href: '/admin/roles' },
    { id: 'cambios', icon: '🔐', label: 'Registro de Cambios', href: '/admin/cambios' },
  ];

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Registro de Cambios</h1>
          <p className="page-subtitle">Historial completo de todas las operaciones del sistema</p>
        </div>
      </div>

      <div className="section messages-list">
        {comments && comments.length ? (
          comments.map((c, idx) => (
            <div key={idx} className="message-card">
              <div className="message-meta">
                <strong>{c.author}</strong>
                <span>{c.type}</span>
              </div>
              <div className="message-body">{c.message}</div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
            No hay cambios registrados aún.
          </p>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminCambios;
