import React from 'react';
import { MainLayout } from '../../components/common/Layout';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

export const VicedeanoDashboard = () => {
  const { professors, disciplines, comments } = useData();

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'manage', icon: '👥', label: 'Gestión de Profesores', href: '/vicedecano/gestion' },
    { id: 'reports', icon: '📋', label: 'Reportes', href: '/vicedecano/reportes' },
    { id: 'messages', icon: '💬', label: 'Mensajes', href: '/vicedecano/mensajes' },
  ];

  const facultades = [...new Set(professors.map(p => p.faculty))];

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión Integral de Carga Docente</h1>
          <p className="page-subtitle">Administra todas las disciplinas y facultades del sistema</p>
        </div>
      </div>

      <div className="admin-grid">
        <div className="stats-card">
          <div className="stat-number">{professors.length}</div>
          <div className="stat-label">Profesores Totales</div>
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
          <a href="/vicedecano/gestion" className="quick-access-card">
            <div className="quick-access-icon">👥</div>
            <div className="quick-access-title">Gestión de Profesores</div>
            <div className="quick-access-desc">Visualiza, edita y elimina profesores</div>
          </a>
          <a href="/vicedecano/reportes" className="quick-access-card">
            <div className="quick-access-icon">📋</div>
            <div className="quick-access-title">Reportes</div>
            <div className="quick-access-desc">Descarga reportes y estadísticas</div>
          </a>
          <a href="/vicedecano/mensajes" className="quick-access-card">
            <div className="quick-access-icon">💬</div>
            <div className="quick-access-title">Mensajes</div>
            <div className="quick-access-desc">Revisa el historial de cambios</div>
          </a>
        </div>
      </div>

      <div className="section">
        <h2>Cambios Recientes</h2>
        <div className="messages-list">
          {comments && comments.length ? (
            comments.slice(0, 5).map((c, idx) => (
              <div key={idx} className="message-card">
                <div className="message-meta">
                  <strong>{c.author}</strong>
                  <span>{c.type}</span>
                </div>
                <div className="message-body">{c.message}</div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#999' }}>No hay cambios registrados</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
