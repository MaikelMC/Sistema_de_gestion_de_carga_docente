import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/common/Layout';
import { useData } from '../../context/DataContext';
import './DashboardDirector.css';

export const DirectorDashboard = () => {
  const navigate = useNavigate();
  const { professors = [], disciplines = [], comments = [], messages = [] } = useData();

  // Sidebar items con rutas reales
  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/director/dashboard' },
    { id: 'professors', icon: '👨‍🏫', label: 'Profesores', href: '/director/profesores' },
    { id: 'assignments', icon: '📋', label: 'Asignaciones', href: '/director/asignaciones' },
    { id: 'reports', icon: '📄', label: 'Reportes', href: '/director/reportes' },
    { id: 'messages', icon: '💬', label: 'Mensajes', href: '/director/mensajes' },
  ];

  // Estadísticas generales
  const stats = useMemo(() => ({
    totalProfessors: (professors || []).length,
    totalDisciplines: (disciplines || []).length,
    totalFaculties: [...new Set((professors || []).map(p => p.faculty))].length,
    recentChanges: (comments || []).filter(c => {
      const daysAgo = (new Date() - new Date(c.timestamp)) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    }).length,
    totalAssignments: 0,
    pendingApprovals: 0,
    availableProfessors: (professors || []).filter(p => p.available).length,
    averageLoad: (professors || []).length > 0
      ? (professors || []).reduce((acc, p) => acc + (p.load || 0), 0) / (professors || []).length
      : 0,
  }), [professors, disciplines, comments]);

  // Agrupar profesores por facultad
  const professorsByFaculty = useMemo(() => {
    const grouped = {};
    professors.forEach(prof => {
      const faculty = prof.faculty || 'Sin facultad';
      if (!grouped[faculty]) {
        grouped[faculty] = [];
      }
      grouped[faculty].push(prof);
    });
    return grouped;
  }, [professors]);

  // Agrupar profesores por disciplina para visualización
  const professorsByDiscipline = useMemo(() => {
    const grouped = {};
    professors.forEach(prof => {
      const discipline = prof.department || 'Sin disciplina';
      if (!grouped[discipline]) {
        grouped[discipline] = [];
      }
      grouped[discipline].push(prof);
    });
    return Object.entries(grouped)
      .map(([name, profs]) => ({
        name,
        count: profs.length,
        percentage: ((profs.length / professors.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [professors]);

  // Agrupar asignaciones por disciplina
  const assignmentsByDiscipline = useMemo(() => {
    const assignments = [];
    return assignments.reduce((acc, assignment) => {
      if (!acc[assignment.discipline]) {
        acc[assignment.discipline] = [];
      }
      acc[assignment.discipline].push(assignment);
      return acc;
    }, {});
  }, []);

  // Generar CSV
  const generateCSV = (data, filename) => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler para descargar reportes
  const handleDownloadReport = (type) => {
    switch(type) {
      case 'professors':
        generateCSV(professors, 'profesores_general');
        break;
      case 'assignments':
        generateCSV([], 'asignaciones_general');
        break;
      case 'professors_by_faculty':
        const facultyData = Object.entries(professorsByFaculty).flatMap(([faculty, profs]) => profs.map(p => ({ ...p, faculty_group: faculty })));
        generateCSV(facultyData, 'profesores_por_facultad');
        break;
      case 'assignments_by_discipline':
        generateCSV([], 'asignaciones_por_disciplina');
        break;
      default:
        break;
    }
  };

  // Renderizar Dashboard
  const renderDashboard = () => (
    <div className="director-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Director</h1>
          <p className="page-subtitle">Panel de control general del sistema</p>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalProfessors}</div>
            <div className="stat-label">Total Profesores</div>
          </div>
          <div className="stat-trend positive">+{stats.availableProfessors} disponibles</div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalDisciplines}</div>
            <div className="stat-label">Disciplinas</div>
          </div>
          <div className="stat-trend">
            {Object.keys(assignmentsByDiscipline).length} activas
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">🏛️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalFaculties}</div>
            <div className="stat-label">Facultades</div>
          </div>
          <div className="stat-trend">
            {Object.keys(professorsByFaculty).length} con profesores
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.averageLoad.toFixed(1)}</div>
            <div className="stat-label">Promedio Horas</div>
          </div>
          <div className="stat-trend negative">
            {stats.pendingApprovals} pendientes
          </div>
        </div>
      </div>

      {/* Sección rápida de acciones */}
      <div className="quick-actions-modern">
        <h2 className="section-title-large">Acciones Rápidas</h2>
        <div className="actions-grid-modern">
          <button 
            className="action-card-modern primary"
            onClick={() => navigate('/director/profesores')}
          >
            <div className="action-icon-container">
              <span className="action-icon-large">👨‍🏫</span>
            </div>
            <div className="action-content">
              <h3 className="action-title">Ver Profesores</h3>
              <p className="action-description">Gestionar base de datos</p>
            </div>
            <div className="action-arrow">→</div>
          </button>
          <button 
            className="action-card-modern secondary"
            onClick={() => navigate('/director/asignaciones')}
          >
            <div className="action-icon-container">
              <span className="action-icon-large">📋</span>
            </div>
            <div className="action-content">
              <h3 className="action-title">Asignaciones</h3>
              <p className="action-description">Cargas docentes</p>
            </div>
            <div className="action-arrow">→</div>
          </button>
          <button 
            className="action-card-modern success"
            onClick={() => handleDownloadReport('professors')}
          >
            <div className="action-icon-container">
              <span className="action-icon-large">📥</span>
            </div>
            <div className="action-content">
              <h3 className="action-title">Descargar</h3>
              <p className="action-description">Exportar datos CSV</p>
            </div>
            <div className="action-arrow">→</div>
          </button>
          <button 
            className="action-card-modern info"
            onClick={() => navigate('/director/reportes')}
          >
            <div className="action-icon-container">
              <span className="action-icon-large">📊</span>
            </div>
            <div className="action-content">
              <h3 className="action-title">Reportes</h3>
              <p className="action-description">Análisis detallado</p>
            </div>
            <div className="action-arrow">→</div>
          </button>
        </div>
      </div>

      {/* Distribución de Profesores */}
      <div className="data-visualization-section">
        <div className="viz-container">
          <div className="chart-card">
            <h2 className="section-title-large">Distribución por Disciplina</h2>
            <p className="chart-subtitle">Top 5 disciplinas con más profesores</p>
            <div className="bar-chart">
              {professorsByDiscipline.map((item, index) => (
                <div key={item.name} className="bar-item">
                  <div className="bar-label-container">
                    <span className="bar-rank">#{index + 1}</span>
                    <span className="bar-label">{item.name}</span>
                    <span className="bar-count">{item.count} prof.</span>
                  </div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill"
                      style={{ width: `${item.percentage}%` }}
                    >
                      <span className="bar-percentage">{item.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-card">
            <h2 className="section-title-large">Actividad Reciente</h2>
            <p className="chart-subtitle">Últimos 7 días</p>
            <div className="activity-list">
              {comments.slice(0, 5).map((comment, index) => {
                const timeAgo = Math.floor((new Date() - new Date(comment.timestamp)) / (1000 * 60 * 60));
                return (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {comment.type === 'add' ? '➕' : '✏️'}
                    </div>
                    <div className="activity-content">
                      <p className="activity-message">{comment.message}</p>
                      <span className="activity-time">
                        {timeAgo < 24 ? `${timeAgo}h` : `${Math.floor(timeAgo / 24)}d`} atrás
                      </span>
                    </div>
                  </div>
                );
              })}
              {comments.length === 0 && (
                <div className="empty-activity">
                  <span className="empty-icon">📭</span>
                  <p>No hay actividad reciente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout sidebarItems={sidebarItems}>
      {renderDashboard()}
    </MainLayout>
  );
};