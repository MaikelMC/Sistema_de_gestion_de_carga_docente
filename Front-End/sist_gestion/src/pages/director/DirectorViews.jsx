import React, { useState } from 'react';
import { SearchFilter } from '../../components/common/SearchFilter';
import { Table } from '../../components/common/Table';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import './DashboardDirector.css';

export const DirectorProfessorsView = () => {
  const { professors, disciplines } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table'); // table, cards

  // Filtrado
  let filteredProfessors = professors.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDiscipline = !filterDiscipline || p.department === filterDiscipline;
    const matchFaculty = !filterFaculty || p.faculty === filterFaculty;
    return matchSearch && matchDiscipline && matchFaculty;
  });

  // Ordenamiento
  filteredProfessors = [...filteredProfessors].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'email':
        return a.email.localeCompare(b.email);
      case 'department':
        return a.department.localeCompare(b.department);
      case 'faculty':
        return a.faculty.localeCompare(b.faculty);
      default:
        return 0;
    }
  });

  const filterOptions = [
    {
      id: 'discipline',
      label: 'Disciplina',
      value: filterDiscipline,
      options: [...new Set(professors.map(p => p.department))]
    },
    {
      id: 'faculty',
      label: 'Facultad',
      value: filterFaculty,
      options: [...new Set(professors.map(p => p.faculty))]
    }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nombre (A-Z)' },
    { value: 'email', label: 'Email' },
    { value: 'department', label: 'Disciplina' },
    { value: 'faculty', label: 'Facultad' }
  ];

  const handleFilterChange = (filterId, value) => {
    if (filterId === 'discipline') setFilterDiscipline(value);
    if (filterId === 'faculty') setFilterFaculty(value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterDiscipline('');
    setFilterFaculty('');
  };

  const columns = [
    { key: 'name', label: 'Nombre del Profesor' },
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'department', label: 'Disciplina' },
    { key: 'subjects', label: 'Asignaturas', render: (row) => {
      if (Array.isArray(row.subjects) && row.subjects.length > 0) {
        return row.subjects.join(', ');
      }
      return '-';
    }},
    { key: 'faculty', label: 'Facultad', render: (row) => row.faculty || '-' },
  ];

  return (
    <div className="director-view">
      <div className="view-header">
        <div>
          <h2>📋 Ver Profesores</h2>
          <p>Consulta todos los profesores del sistema</p>
        </div>
        <div className="view-actions">
          <button
            className={`view-toggle ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Vista de tabla"
          >
            ☰ Tabla
          </button>
          <button
            className={`view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
            title="Vista de tarjetas"
          >
            ▦ Tarjetas
          </button>
        </div>
      </div>

      <div className="search-section">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          sortOptions={sortOptions}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
          hasActiveFilters={!!searchTerm || !!filterDiscipline || !!filterFaculty}
        />
      </div>

      <div className="results-info">
        <span>Mostrando {filteredProfessors.length} de {professors.length} profesores</span>
        {searchTerm && <span className="info-badge">Búsqueda: "{searchTerm}"</span>}
        {filterDiscipline && <span className="info-badge">Disciplina: {filterDiscipline}</span>}
        {filterFaculty && <span className="info-badge">Facultad: {filterFaculty}</span>}
      </div>

      {viewMode === 'table' ? (
        <div className="table-view">
          <Table columns={columns} data={filteredProfessors} />
        </div>
      ) : (
        <div className="cards-view">
          {filteredProfessors.length > 0 ? (
            <div className="professors-grid">
              {filteredProfessors.map(prof => (
                <div key={prof.id} className="professor-card">
                  <div className="card-header">
                    <h3>{prof.name}</h3>
                    <span className="badge">{prof.department}</span>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Email:</span>
                      <span className="value">{prof.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Facultad:</span>
                      <span className="value">{prof.faculty || '-'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Asignaturas:</span>
                      <div className="subjects-list">
                        {Array.isArray(prof.subjects) && prof.subjects.length > 0 ? (
                          prof.subjects.map((subject, idx) => (
                            <span key={idx} className="subject-tag">{subject}</span>
                          ))
                        ) : (
                          <span className="no-subjects">Sin asignaturas asignadas</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No se encontraron profesores con los criterios seleccionados</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const DirectorReportsView = () => {
  const { professors, disciplines } = useData();
  const { showSuccess, showError } = useNotification();

  const statsPerDiscipline = disciplines.map(d => ({
    name: d.name,
    count: professors.filter(p => p.department === d.name).length,
    faculty: d.faculty
  }));

  const statsPerFaculty = [...new Set(professors.map(p => p.faculty))].map(faculty => ({
    faculty,
    count: professors.filter(p => p.faculty === faculty).length
  }));

  const handleDownloadReport = (type) => {
    let filename = 'reporte.csv';
    let headers = [];
    let rows = [];

    switch (type) {
      case 'complete':
        filename = 'reporte_profesores_completo.csv';
        headers = ['ID', 'Nombre', 'Email', 'Disciplina', 'Asignaturas', 'Facultad', 'Fecha Registro'];
        rows = professors.map(p => [
          p.id,
          p.name,
          p.email,
          p.department,
          p.subjects.join('; '),
          p.faculty,
          new Date(p.createdAt).toLocaleDateString('es-ES')
        ]);
        break;

      case 'by-discipline':
        filename = 'reporte_por_disciplina.csv';
        headers = ['Disciplina', 'Facultad', 'Total de Profesores', 'Porcentaje'];
        rows = statsPerDiscipline.map(d => [
          d.name,
          d.faculty,
          d.count,
          `${Math.round((d.count / professors.length) * 100)}%`
        ]);
        break;

      case 'by-faculty':
        filename = 'reporte_por_facultad.csv';
        headers = ['Facultad', 'Total de Profesores', 'Porcentaje'];
        rows = statsPerFaculty.map(f => [
          f.faculty,
          f.count,
          `${Math.round((f.count / professors.length) * 100)}%`
        ]);
        break;

      case 'by-subject': {
        filename = 'reporte_por_asignatura.csv';
        const subjectMap = {};
        professors.forEach(p => {
          p.subjects.forEach(subject => {
            if (!subjectMap[subject]) {
              subjectMap[subject] = { count: 0, professors: [] };
            }
            subjectMap[subject].count++;
            subjectMap[subject].professors.push(p.name);
          });
        });
        headers = ['Asignatura', 'Total de Profesores', 'Profesores'];
        rows = Object.entries(subjectMap).map(([subject, data]) => [
          subject,
          data.count,
          data.professors.join('; ')
        ]);
        break;
      }
    }

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

  return (
    <div className="director-view">
      <div className="view-header">
        <div>
          <h2>📊 Reportes</h2>
          <p>Descarga reportes detallados en formato CSV</p>
        </div>
      </div>

      <div className="reports-section">
        <div className="reports-grid">
          <div className="report-card">
            <div className="report-icon">📋</div>
            <h3>Reporte Completo</h3>
            <p>Descarga todos los profesores con información detallada</p>
            <button
              className="btn btn-primary"
              onClick={() => handleDownloadReport('complete')}
            >
              Descargar CSV
            </button>
          </div>

          <div className="report-card">
            <div className="report-icon">📊</div>
            <h3>Por Disciplina</h3>
            <p>Resumen de profesores agrupados por disciplina</p>
            <button
              className="btn btn-primary"
              onClick={() => handleDownloadReport('by-discipline')}
            >
              Descargar CSV
            </button>
          </div>

          <div className="report-card">
            <div className="report-icon">🏢</div>
            <h3>Por Facultad</h3>
            <p>Resumen de profesores agrupados por facultad</p>
            <button
              className="btn btn-primary"
              onClick={() => handleDownloadReport('by-faculty')}
            >
              Descargar CSV
            </button>
          </div>

          <div className="report-card">
            <div className="report-icon">📚</div>
            <h3>Por Asignatura</h3>
            <p>Resumen de profesores por asignatura impartida</p>
            <button
              className="btn btn-primary"
              onClick={() => handleDownloadReport('by-subject')}
            >
              Descargar CSV
            </button>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-columns">
          <div className="stats-column">
            <h3>📊 Profesores por Disciplina</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Disciplina</th>
                  <th>Cantidad</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {statsPerDiscipline.map((stat, idx) => (
                  <tr key={idx}>
                    <td>{stat.name}</td>
                    <td className="text-center">{stat.count}</td>
                    <td className="text-center">
                      <span className="percentage-badge">
                        {Math.round((stat.count / professors.length) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="stats-column">
            <h3>🏢 Profesores por Facultad</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Facultad</th>
                  <th>Cantidad</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {statsPerFaculty.map((stat, idx) => (
                  <tr key={idx}>
                    <td>{stat.faculty}</td>
                    <td className="text-center">{stat.count}</td>
                    <td className="text-center">
                      <span className="percentage-badge">
                        {Math.round((stat.count / professors.length) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DirectorAssignmentsView = () => {
  const { professors } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('professor');

  // Generar asignaciones desde profesores
  const assignments = professors.flatMap(prof => 
    (prof.subjects || []).map(subject => ({
      id: `${prof.id}-${subject}`,
      professor: prof.name,
      email: prof.email,
      faculty: prof.faculty,
      discipline: prof.department,
      subject: subject,
      load: prof.load || 0,
      status: prof.available ? 'activa' : 'inactiva',
      date: new Date().toLocaleDateString()
    }))
  );

  // Filtrado
  let filtered = assignments.filter(a => {
    const matchSearch = a.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       a.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       a.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Ordenamiento
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'professor':
        return a.professor.localeCompare(b.professor);
      case 'subject':
        return a.subject.localeCompare(b.subject);
      case 'load':
        return b.load - a.load;
      default:
        return 0;
    }
  });

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'activa').length,
    inactive: assignments.filter(a => a.status === 'inactiva').length,
    avgLoad: assignments.length > 0 ? (assignments.reduce((sum, a) => sum + a.load, 0) / assignments.length).toFixed(1) : 0
  };

  return (
    <div className="director-view">
      <div className="view-header">
        <div>
          <h2>📋 Asignaciones de Carga Docente</h2>
          <p>Gestiona y visualiza todas las asignaciones</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid-assignments">
        <div className="stat-card-assignment primary">
          <div className="stat-card-assignment-content">
            <div className="stat-card-assignment-top">
              <span className="stat-icon-assignment">📚</span>
              <span className="stat-label-assignment">Total</span>
            </div>
            <div className="stat-value-assignment">{stats.total}</div>
            <div className="stat-description-assignment">Asignaciones</div>
          </div>
        </div>

        <div className="stat-card-assignment success">
          <div className="stat-card-assignment-content">
            <div className="stat-card-assignment-top">
              <span className="stat-icon-assignment">✅</span>
              <span className="stat-label-assignment">Activas</span>
            </div>
            <div className="stat-value-assignment">{stats.active}</div>
            <div className="stat-description-assignment">En servicio</div>
          </div>
        </div>

        <div className="stat-card-assignment warning">
          <div className="stat-card-assignment-content">
            <div className="stat-card-assignment-top">
              <span className="stat-icon-assignment">⏸️</span>
              <span className="stat-label-assignment">Inactivas</span>
            </div>
            <div className="stat-value-assignment">{stats.inactive}</div>
            <div className="stat-description-assignment">Suspendidas</div>
          </div>
        </div>

        <div className="stat-card-assignment info">
          <div className="stat-card-assignment-content">
            <div className="stat-card-assignment-top">
              <span className="stat-icon-assignment">⏱️</span>
              <span className="stat-label-assignment">Promedio</span>
            </div>
            <div className="stat-value-assignment">{stats.avgLoad}h</div>
            <div className="stat-description-assignment">Carga horaria</div>
          </div>
        </div>
      </div>

      {/* Filtros y controles */}
      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Buscar por profesor, asignatura o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las asignaciones</option>
            <option value="activa">Activas</option>
            <option value="inactiva">Inactivas</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="professor">Ordenar por profesor</option>
            <option value="subject">Ordenar por asignatura</option>
            <option value="load">Ordenar por carga horaria</option>
          </select>
        </div>
      </div>

      {/* Tabla de asignaciones */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Profesor</th>
              <th>Email</th>
              <th>Facultad</th>
              <th>Disciplina</th>
              <th>Asignatura</th>
              <th>Carga (h)</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="professor-cell">
                    <div className="avatar" style={{ backgroundColor: '#007bff' }}>
                      {assignment.professor.charAt(0)}
                    </div>
                    {assignment.professor}
                  </td>
                  <td>{assignment.email}</td>
                  <td>
                    <span className="badge badge-info">{assignment.faculty}</span>
                  </td>
                  <td>
                    <span className="badge badge-secondary">{assignment.discipline}</span>
                  </td>
                  <td>
                    <span className="subject-badge">{assignment.subject}</span>
                  </td>
                  <td>
                    <span className="load-badge">{assignment.load}h</span>
                  </td>
                  <td>
                    <span className={`status-badge ${assignment.status === 'activa' ? 'active' : 'inactive'}`}>
                      {assignment.status === 'activa' ? '✓ Activa' : '✗ Inactiva'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn edit" title="Editar">✏️</button>
                    <button className="action-btn delete" title="Eliminar">🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-cell">
                  <div className="empty-state">
                    <p>No hay asignaciones que coincidan con los filtros</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Resumen por facultad eliminado por solicitud - espacio reservado si se necesita más adelante */}
    </div>
  );
};

export const DirectorMessagesView = () => {
  const { comments } = useData();
  const [filterType, setFilterType] = useState('all');

  const filteredComments = filterType === 'all'
    ? comments
    : comments.filter(c => c.type === filterType);

  const sortedComments = [...filteredComments].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const messageStats = {
    total: comments.length,
    adds: comments.filter(c => c.type === 'add').length,
    edits: comments.filter(c => c.type === 'edit').length,
    last7days: comments.filter(c => {
      const daysAgo = (new Date() - new Date(c.timestamp)) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    }).length
  };

  return (
    <div className="director-view">
      <div className="view-header">
        <div>
          <h2>💬 Mensajes y Cambios</h2>
          <p>Registro de cambios realizados por Jefes de Disciplina</p>
        </div>
      </div>

      <div className="messages-stats-section">
        <div className="message-stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <div className="stat-number">{messageStats.total}</div>
            <div className="stat-label">Total de Cambios</div>
          </div>
        </div>
        <div className="message-stat-card">
          <div className="stat-icon">➕</div>
          <div className="stat-info">
            <div className="stat-number">{messageStats.adds}</div>
            <div className="stat-label">Agregaciones</div>
          </div>
        </div>
        <div className="message-stat-card">
          <div className="stat-icon">✏️</div>
          <div className="stat-info">
            <div className="stat-number">{messageStats.edits}</div>
            <div className="stat-label">Modificaciones</div>
          </div>
        </div>
        <div className="message-stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-number">{messageStats.last7days}</div>
            <div className="stat-label">Últimos 7 días</div>
          </div>
        </div>
      </div>

      <div className="messages-filter">
        <button
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          Todos ({comments.length})
        </button>
        <button
          className={`filter-btn ${filterType === 'add' ? 'active' : ''}`}
          onClick={() => setFilterType('add')}
        >
          Agregaciones ({messageStats.adds})
        </button>
        <button
          className={`filter-btn ${filterType === 'edit' ? 'active' : ''}`}
          onClick={() => setFilterType('edit')}
        >
          Modificaciones ({messageStats.edits})
        </button>
      </div>

      <div className="messages-list">
        {sortedComments.length > 0 ? (
          sortedComments.map(comment => (
            <div key={comment.id} className="message-card">
              <div className="message-card-header">
                <div>
                  <h4 className="message-author">{comment.author}</h4>
                  <p className="message-time">
                    {new Date(comment.timestamp).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} - {new Date(comment.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`message-type-badge ${comment.type}`}>
                  {comment.type === 'add' ? '✚ Agregación' : '✎ Modificación'}
                </span>
              </div>
              <div className="message-card-content">
                <p className="message-text">{comment.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No hay mensajes en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
};

