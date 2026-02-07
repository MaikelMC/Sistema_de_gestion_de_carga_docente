import React from 'react';
import { MainLayout } from '../../components/common/Layout';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import './Dashboard.css';

export const VicedecanoReportes = () => {
  const { professors } = useData();
  const { showSuccess } = useNotification();

  const handleDownloadCSV = (type) => {
    let filename = 'profesores.csv';
    let data = professors;

    if (type === 'all') {
      filename = 'profesores_completo.csv';
    }

    const headers = ['ID', 'Nombre', 'Email', 'Disciplina', 'Asignaturas', 'Facultad'];
    const rows = data.map(p => [
      p.id,
      p.name,
      p.email,
      p.department,
      p.subjects.join('; '),
      p.faculty
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    showSuccess(`${filename} descargado exitosamente`);
  };

  const disciplinas = [...new Set(professors.map(p => p.department))];
  const facultades = [...new Set(professors.map(p => p.faculty))];

  const profesoresPorDisciplina = disciplinas.map(d => ({
    name: d,
    count: professors.filter(p => p.department === d).length
  }));

  const profesoresPorFacultad = facultades.map(f => ({
    name: f,
    count: professors.filter(p => p.faculty === f).length
  }));

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
          <h1 className="page-title">Reportes</h1>
          <p className="page-subtitle">Descarga y visualiza reportes detallados de profesores</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="admin-grid">
        <div className="stats-card">
          <div className="stat-number">{professors.length}</div>
          <div className="stat-label">Profesores Totales</div>
        </div>
        <div className="stats-card">
          <div className="stat-number">{disciplinas.length}</div>
          <div className="stat-label">Disciplinas</div>
        </div>
        <div className="stats-card">
          <div className="stat-number">{facultades.length}</div>
          <div className="stat-label">Facultades</div>
        </div>
      </div>

      {/* Descargas */}
      <div className="section">
        <h2>Descargas</h2>
        <div className="download-buttons">
          <button className="btn btn-primary" onClick={() => handleDownloadCSV('all')}>
            📥 Descargar Todos los Profesores
          </button>
        </div>
      </div>

      {/* Profesores por Disciplina */}
      <div className="section">
        <h2>Profesores por Disciplina</h2>
        <div className="report-grid">
          {profesoresPorDisciplina.map(d => (
            <div key={d.name} className="report-card">
              <div className="report-label">{d.name}</div>
              <div className="report-value">{d.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Profesores por Facultad */}
      <div className="section">
        <h2>Profesores por Facultad</h2>
        <div className="report-grid">
          {profesoresPorFacultad.map(f => (
            <div key={f.name} className="report-card">
              <div className="report-label">{f.name}</div>
              <div className="report-value">{f.count}</div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default VicedecanoReportes;
