import React from 'react';
import { MainLayout } from '../../components/common/Layout';
import { DirectorMessagesView } from './DirectorViews';
import './DashboardDirector.css';

export const DirectorMensajes = () => {
  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'professors', icon: '👨‍🏫', label: 'Ver Profesores', href: '/director/profesores' },
    { id: 'reports', icon: '📋', label: 'Reportes', href: '/director/reportes' },
    { id: 'messages', icon: '💬', label: 'Mensajes', href: '/director/mensajes' },
  ];

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mensajes y Cambios</h1>
          <p className="page-subtitle">Registro de cambios realizados por Jefes de Disciplina</p>
        </div>
      </div>

      <DirectorMessagesView />
    </MainLayout>
  );
};
