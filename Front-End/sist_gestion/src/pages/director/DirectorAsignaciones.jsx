import React, { useState } from 'react';
import { MainLayout } from '../../components/common/Layout';
import { DirectorAssignmentsView } from './DirectorViews';
import './DashboardDirector.css';

export const DirectorAsignaciones = () => {
  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/director/dashboard' },
    { id: 'professors', icon: '👨‍🏫', label: 'Profesores', href: '/director/profesores' },
    { id: 'assignments', icon: '📋', label: 'Asignaciones', href: '/director/asignaciones' },
    { id: 'reports', icon: '📄', label: 'Reportes', href: '/director/reportes' },
    { id: 'messages', icon: '💬', label: 'Mensajes', href: '/director/mensajes' },
  ];

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Asignaciones</h1>
          <p className="page-subtitle">Visualiza y gestiona las asignaciones de carga docente</p>
        </div>
      </div>

      <DirectorAssignmentsView />
    </MainLayout>
  );
};
