import React from 'react';
import { MainLayout } from '../../components/common/Layout';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

export const JefeMensajes = () => {
  const { comments } = useData();

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'manage', icon: '👥', label: 'Gestión de Profesores', href: '/jefe/gestion' },
    { id: 'messages', icon: '💬', label: 'Mensajes', href: '/jefe/mensajes' },
  ];

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mensajes y Comentarios</h1>
          <p className="page-subtitle">Registro de cambios y comunicaciones</p>
        </div>
      </div>

      <div className="section messages-list">
        {comments && comments.length ? (
          comments.map((c, idx) => (
            <div key={idx} className="message-card">
              <div className="message-meta">
                <strong>{c.author}</strong> • <span>{c.type}</span>
              </div>
              <div className="message-body">{c.message}</div>
            </div>
          ))
        ) : (
          <p>No hay mensajes registrados.</p>
        )}
      </div>
    </MainLayout>
  );
};

export default JefeMensajes;
