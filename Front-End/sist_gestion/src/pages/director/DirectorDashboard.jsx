import React, { useState, useMemo } from 'react';
import { MainLayout } from '../../components/common/Layout';
import { useData } from '../../context/DataContext';
import './DashboardDirector.css';

export const DirectorDashboard = () => {
  const { professors, disciplines, faculties, comments, assignments } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [messageFilter, setMessageFilter] = useState('all');

  // Sidebar items con estado activo
  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '#dashboard' },
    { id: 'professors', icon: '👨‍🏫', label: 'Profesores', href: '#professors' },
    { id: 'assignments', icon: '📋', label: 'Asignaciones', href: '#assignments' },
    { id: 'reports', icon: '📄', label: 'Reportes', href: '#reports' },
    { id: 'messages', icon: '💬', label: 'Mensajes', href: '#messages' },
  ];

  // Estadísticas generales
  const stats = useMemo(() => ({
    totalProfessors: professors.length,
    totalDisciplines: disciplines.length,
    totalFaculties: [...new Set(professors.map(p => p.faculty))].length,
    recentChanges: comments.filter(c => {
      const daysAgo = (new Date() - new Date(c.timestamp)) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    }).length,
    totalAssignments: assignments.length,
    pendingApprovals: assignments.filter(a => a.status === 'pending').length,
    availableProfessors: professors.filter(p => p.available).length,
    averageLoad: professors.reduce((acc, p) => acc + (p.load || 0), 0) / professors.length || 0,
  }), [professors, disciplines, comments, assignments]);

  // Filtrar profesores
  const filteredProfessors = useMemo(() => {
    let filtered = [...professors];
    if (selectedFaculty !== 'all') {
      filtered = filtered.filter(p => p.faculty === selectedFaculty);
    }
    if (selectedDiscipline !== 'all') {
      filtered = filtered.filter(p => p.discipline === selectedDiscipline);
    }
    return filtered;
  }, [professors, selectedFaculty, selectedDiscipline]);

  // Obtener facultades únicas
  const uniqueFaculties = useMemo(() => {
    const facultiesSet = new Set(professors.map(p => p.faculty));
    return ['all', ...Array.from(facultiesSet)];
  }, [professors]);

  // Obtener disciplinas únicas
  const uniqueDisciplines = useMemo(() => {
    const disciplinesSet = new Set(professors.map(p => p.discipline));
    return ['all', ...Array.from(disciplinesSet)];
  }, [professors]);

  // Agrupar profesores por facultad
  const professorsByFaculty = useMemo(() => {
    return professors.reduce((acc, professor) => {
      if (!acc[professor.faculty]) {
        acc[professor.faculty] = [];
      }
      acc[professor.faculty].push(professor);
      return acc;
    }, {});
  }, [professors]);

  // Agrupar asignaciones por disciplina
  const assignmentsByDiscipline = useMemo(() => {
    return assignments.reduce((acc, assignment) => {
      if (!acc[assignment.discipline]) {
        acc[assignment.discipline] = [];
      }
      acc[assignment.discipline].push(assignment);
      return acc;
    }, {});
  }, [assignments]);

  // Filtrar mensajes
  const filteredMessages = useMemo(() => {
    if (messageFilter === 'all') return comments;
    if (messageFilter === 'recent') {
      return comments.filter(c => {
        const daysAgo = (new Date() - new Date(c.timestamp)) / (1000 * 60 * 60 * 24);
        return daysAgo <= 7;
      });
    }
    return comments.filter(c => c.type === messageFilter);
  }, [comments, messageFilter]);

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
        generateCSV(assignments, 'asignaciones_general');
        break;
      case 'professors_by_faculty':
        const facultyData = Object.entries(professorsByFaculty).flatMap(([faculty, profs]) => profs.map(p => ({ ...p, faculty_group: faculty })));
        generateCSV(facultyData, 'profesores_por_facultad');
        break;
      case 'assignments_by_discipline':
        const disciplineData = Object.entries(assignmentsByDiscipline).flatMap(([discipline, assigns]) =>
          assigns.map(a => ({ ...a, discipline_group: discipline }))
        );
        generateCSV(disciplineData, 'asignaciones_por_disciplina');
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
      <div className="quick-actions">
        <h2 className="section-title">Acciones Rápidas</h2>
        <div className="actions-grid">
          <button 
            className="action-btn primary"
            onClick={() => setActiveTab('professors')}
          >
            <span className="action-icon">👀</span>
            <span className="action-text">Ver Profesores</span>
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => handleDownloadReport('professors')}
          >
            <span className="action-icon">📥</span>
            <span className="action-text">Descargar CSV</span>
          </button>
          <button 
            className="action-btn accent"
            onClick={() => setActiveTab('messages')}
          >
            <span className="action-icon">💬</span>
            <span className="action-text">Ver Mensajes</span>
          </button>
          <button 
            className="action-btn warning"
            onClick={() => setActiveTab('reports')}
          >
            <span className="action-icon">📊</span>
            <span className="action-text">Generar Reporte</span>
          </button>
        </div>
      </div>

      {/* Vista previa de profesores */}
      <div className="preview-section">
        <div className="section-header">
          <h2 className="section-title">Profesores por Facultad</h2>
          <select 
            className="filter-select"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            {uniqueFaculties.map(faculty => (
              <option key={faculty} value={faculty}>
                {faculty === 'all' ? 'Todas las facultades' : faculty}
              </option>
            ))}
          </select>
        </div>
        
        <div className="faculty-grid">
          {Object.entries(professorsByFaculty)
            .filter(([faculty]) => selectedFaculty === 'all' || faculty === selectedFaculty)
            .slice(0, 4)
            .map(([faculty, professors]) => (
              <div key={faculty} className="faculty-card">
                <h3 className="faculty-name">{faculty}</h3>
                <div className="faculty-stats">
                  <div className="faculty-stat">
                    <span className="stat-value">{professors.length}</span>
                    <span className="stat-label">Profesores</span>
                  </div>
                  <div className="faculty-stat">
                    <span className="stat-value">
                      {[...new Set(professors.map(p => p.discipline))].length}
                    </span>
                    <span className="stat-label">Disciplinas</span>
                  </div>
                </div>
                <button 
                  className="view-btn"
                  onClick={() => {
                    setSelectedFaculty(faculty);
                    setActiveTab('professors');
                  }}
                >
                  Ver Detalles →
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Renderizar Profesores
  const renderProfessors = () => (
    <div className="director-section">
      <div className="section-header">
        <h1 className="page-title">Gestión de Profesores</h1>
        <div className="header-actions">
          <select 
            className="filter-select"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            <option value="all">Todas las facultades</option>
            {uniqueFaculties.filter(f => f !== 'all').map(faculty => (
              <option key={faculty} value={faculty}>{faculty}</option>
            ))}
          </select>
          
          <select 
            className="filter-select"
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
          >
            <option value="all">Todas las disciplinas</option>
            {uniqueDisciplines.filter(d => d !== 'all').map(discipline => (
              <option key={discipline} value={discipline}>{discipline}</option>
            ))}
          </select>

          <button 
            className="download-btn"
            onClick={() => handleDownloadReport('professors_by_faculty')}
          >
            📥 Descargar CSV
          </button>
        </div>
      </div>

      <div className="professors-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Facultad</th>
              <th>Disciplina</th>
              <th>Asignaturas</th>
              <th>Carga (h)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfessors.map(professor => (
              <tr key={professor.id}>
                <td className="professor-name">
                  <div className="avatar">
                    {professor.name.charAt(0)}
                  </div>
                  {professor.name}
                </td>
                <td>{professor.email}</td>
                <td>
                  <span className="faculty-badge">{professor.faculty}</span>
                </td>
                <td>
                  <span className="discipline-badge">{professor.discipline}</span>
                </td>
                <td>
                  <div className="subjects-list">
                    {professor.subjects?.slice(0, 2).map(subject => (
                      <span key={subject} className="subject-tag">{subject}</span>
                    ))}
                    {professor.subjects?.length > 2 && (
                      <span className="more-tag">+{professor.subjects.length - 2}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="load-indicator">
                    <div 
                      className="load-bar"
                      style={{ width: `${Math.min((professor.load || 0) * 10, 100)}%` }}
                    ></div>
                    <span>{professor.load || 0}h</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${professor.available ? 'available' : 'unavailable'}`}>
                    {professor.available ? 'Disponible' : 'No disponible'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Resumen por Facultad</h3>
          <div className="faculty-summary">
            {Object.entries(professorsByFaculty).map(([faculty, professors]) => (
              <div key={faculty} className="faculty-summary-item">
                <span className="faculty-name">{faculty}</span>
                <span className="faculty-count">{professors.length}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="summary-card">
          <h3>Distribución por Disciplina</h3>
          <div className="discipline-distribution">
            {Object.entries(
              professors.reduce((acc, p) => {
                acc[p.discipline] = (acc[p.discipline] || 0) + 1;
                return acc;
              }, {})
            ).map(([discipline, count]) => (
              <div key={discipline} className="discipline-item">
                <div className="discipline-info">
                  <span className="discipline-name">{discipline}</span>
                  <span className="discipline-percentage">
                    {((count / professors.length) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="discipline-bar">
                  <div 
                    className="bar-fill"
                    style={{ width: `${(count / professors.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar Reportes
  const renderReports = () => (
    <div className="director-section">
      <div className="section-header">
        <h1 className="page-title">Reportes y Exportación</h1>
        <p className="page-subtitle">Genera y descarga reportes en formato CSV</p>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <div className="report-icon">👨‍🏫</div>
          <h3>Reporte General de Profesores</h3>
          <p>Listado completo de todos los profesores con sus datos</p>
          <div className="report-stats">
            <span>{stats.totalProfessors} registros</span>
            <span>{stats.totalFaculties} facultades</span>
          </div>
          <button 
            className="download-report-btn"
            onClick={() => handleDownloadReport('professors')}
          >
            Descargar CSV
          </button>
        </div>

        <div className="report-card">
          <div className="report-icon">🏛️</div>
          <h3>Profesores por Facultad</h3>
          <p>Agrupado por facultad con detalles específicos</p>
          <div className="report-stats">
            <span>{Object.keys(professorsByFaculty).length} grupos</span>
            <span>{stats.totalProfessors} profesores</span>
          </div>
          <button 
            className="download-report-btn"
            onClick={() => handleDownloadReport('professors_by_faculty')}
          >
            Descargar CSV
          </button>
        </div>

        <div className="report-card">
          <div className="report-icon">📚</div>
          <h3>Asignaciones por Disciplina</h3>
          <p>Distribución de asignaciones organizada por disciplina</p>
          <div className="report-stats">
            <span>{Object.keys(assignmentsByDiscipline).length} disciplinas</span>
            <span>{stats.totalAssignments} asignaciones</span>
          </div>
          <button 
            className="download-report-btn"
            onClick={() => handleDownloadReport('assignments_by_discipline')}
          >
            Descargar CSV
          </button>
        </div>

        <div className="report-card">
          <div className="report-icon">📋</div>
          <h3>Reporte de Asignaciones</h3>
          <p>Todas las asignaciones con estado y detalles</p>
          <div className="report-stats">
            <span>{stats.totalAssignments} asignaciones</span>
            <span>{stats.pendingApprovals} pendientes</span>
          </div>
          <button 
            className="download-report-btn"
            onClick={() => handleDownloadReport('assignments')}
          >
            Descargar CSV
          </button>
        </div>
      </div>

      <div className="custom-report">
        <h2 className="section-title">Reporte Personalizado</h2>
        <div className="custom-filters">
          <select className="filter-select">
            <option value="">Seleccionar facultad...</option>
            {uniqueFaculties.filter(f => f !== 'all').map(faculty => (
              <option key={faculty} value={faculty}>{faculty}</option>
            ))}
          </select>
          
          <select className="filter-select">
            <option value="">Seleccionar disciplina...</option>
            {uniqueDisciplines.filter(d => d !== 'all').map(discipline => (
              <option key={discipline} value={discipline}>{discipline}</option>
            ))}
          </select>
          
          <select className="filter-select">
            <option value="">Tipo de reporte...</option>
            <option value="detailed">Detallado</option>
            <option value="summary">Resumido</option>
            <option value="comparative">Comparativo</option>
          </select>
          
          <button className="generate-btn">
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar Mensajes
  const renderMessages = () => (
    <div className="director-section">
      <div className="section-header">
        <h1 className="page-title">Mensajes de los Jefes de Disciplina</h1>
        <div className="header-actions">
          <select 
            className="filter-select"
            value={messageFilter}
            onChange={(e) => setMessageFilter(e.target.value)}
          >
            <option value="all">Todos los mensajes</option>
            <option value="recent">Últimos 7 días</option>
            <option value="urgent">Urgentes</option>
            <option value="info">Informativos</option>
          </select>
        </div>
      </div>

      <div className="messages-container">
        {filteredMessages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>No hay mensajes</h3>
            <p>No se encontraron mensajes con los filtros seleccionados</p>
          </div>
        ) : (
          <div className="messages-list">
            {filteredMessages.map(message => (
              <div key={message.id} className={`message-card ${message.type}`}>
                <div className="message-header">
                  <div className="message-sender">
                    <div className="sender-avatar">
                      {message.sender?.charAt(0) || 'J'}
                    </div>
                    <div className="sender-info">
                      <strong>{message.sender || 'Jefe de Disciplina'}</strong>
                      <span className="sender-role">{message.discipline || 'Disciplina'}</span>
                    </div>
                  </div>
                  <div className="message-meta">
                    <span className="message-date">
                      {new Date(message.timestamp).toLocaleDateString()}
                    </span>
                    <span className={`message-type ${message.type}`}>
                      {message.type === 'urgent' ? '⚠️ Urgente' : '📝 Informativo'}
                    </span>
                  </div>
                </div>
                
                <div className="message-content">
                  <h3 className="message-title">{message.title}</h3>
                  <p className="message-text">{message.content}</p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="message-attachments">
                      <span className="attachments-label">Adjuntos:</span>
                      {message.attachments.map((att, index) => (
                        <span key={index} className="attachment-tag">
                          📎 {att.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="message-actions">
                  <button className="message-action-btn">
                    ✅ Marcar como leído
                  </button>
                  <button className="message-action-btn">
                    📋 Crear tarea
                  </button>
                  <button className="message-action-btn">
                    💬 Responder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="messages-stats">
        <div className="stat-item">
          <div className="stat-value">{comments.length}</div>
          <div className="stat-label">Total mensajes</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {comments.filter(m => m.type === 'urgent').length}
          </div>
          <div className="stat-label">Urgentes</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {comments.filter(m => {
              const daysAgo = (new Date() - new Date(m.timestamp)) / (1000 * 60 * 60 * 24);
              return daysAgo <= 7;
            }).length}
          </div>
          <div className="stat-label">Última semana</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {[...new Set(comments.map(m => m.sender))].length}
          </div>
          <div className="stat-label">Remitentes</div>
        </div>
      </div>
    </div>
  );

  // Renderizar componente principal
  const renderContent = () => {
    switch(activeTab) {
      case 'professors':
        return renderProfessors();
      case 'assignments':
        // Aquí puedes implementar la vista de asignaciones si la necesitas
        return renderProfessors(); // Temporalmente igual a profesores
      case 'reports':
        return renderReports();
      case 'messages':
        return renderMessages();
      default:
        return renderDashboard();
    }
  };

  return (
    <MainLayout 
      sidebarItems={sidebarItems.map(item => ({
        ...item,
        active: activeTab === item.id,
        onClick: () => setActiveTab(item.id)
      }))}
    >
      {renderContent()}
    </MainLayout>
  );
};