import React, { useState } from 'react';
import { MainLayout } from '../../components/common/Layout';
import { Alert } from '../../components/common/Table';
import { DirectorReportsView } from './DirectorViews';
import './DashboardDirector.css';

export const DirectorReportes = () => {
  const [alert, setAlert] = useState(null);

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
          <h1 className="page-title">Reportes</h1>
          <p className="page-subtitle">Descarga reportes detallados en formato CSV</p>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <DirectorReportsView setAlert={setAlert} />
    </MainLayout>
  );
};
