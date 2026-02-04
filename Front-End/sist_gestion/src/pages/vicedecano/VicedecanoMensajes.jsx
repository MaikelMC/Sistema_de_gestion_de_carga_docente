import React from 'react';
import { MainLayout } from '../../components/common/Layout';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

export const VicedecanoMensajes = () => {
  const { comments } = useData();

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
          <h1 className="page-title">Mensajes y Registro de Cambios</h1>
          <p className="page-subtitle">Historial de todas las operaciones realizadas en el sistema</p>
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
            No hay mensajes registrados aún.
          </p>
        )}
      </div>
    </MainLayout>
  );
};

export default VicedecanoMensajes;
