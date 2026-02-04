import React, { useState } from 'react';
import { MainLayout } from '../../components/common/Layout';
import { DirectorProfessorsView } from './DirectorViews';
import './Dashboard.css';

export const DirectorProfesores = () => {
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
          <h1 className="page-title">Profesores</h1>
          <p className="page-subtitle">Visualiza y busca todos los profesores del sistema</p>
        </div>
      </div>

      <DirectorProfessorsView />
    </MainLayout>
  );
};
