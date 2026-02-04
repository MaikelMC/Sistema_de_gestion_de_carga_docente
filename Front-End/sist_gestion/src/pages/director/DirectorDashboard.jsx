import React from 'react';
import { MainLayout } from '../../components/common/Layout';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

export const DirectorDashboard = () => {
  const { professors, disciplines, comments } = useData();

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'professors', icon: '👨‍🏫', label: 'Ver Profesores', href: '/director/profesores' },
    { id: 'reports', icon: '📋', label: 'Reportes', href: '/director/reportes' },
    { id: 'messages', icon: '💬', label: 'Mensajes', href: '/director/mensajes' },
  ];

  // Estadísticas generales
  const facultiesCount = [...new Set(professors.map(p => p.faculty))].length;
  const recentChanges = comments.filter(c => {
    const daysAgo = (new Date() - new Date(c.timestamp)) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  }).length;

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Director de Formación</h1>
          <p className="page-subtitle">Visualiza el resumen general del sistema</p>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="admin-grid">
        <div className="stats-card">
          <div className="stat-number">{professors.length}</div>
          <div className="stat-label">Total de Profesores</div>
        </div>
        <div className="stats-card">
          <div className="stat-number">{disciplines.length}</div>
          <div className="stat-label">Disciplinas</div>
        </div>
        <div className="stats-card">
          <div className="stat-number">{facultiesCount}</div>
          <div className="stat-label">Facultades</div>
        </div>
        <div className="stats-card">
          <div className="stat-number">{recentChanges}</div>
          <div className="stat-label">Cambios (7 días)</div>
        </div>
      </div>
    </MainLayout>
  );
};
