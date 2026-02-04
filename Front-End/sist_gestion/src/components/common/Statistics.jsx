import React from 'react';
import './Statistics.css';

export const StatCard = ({ number, label, icon, color = 'primary' }) => {
  return (
    <div className={`stats-card stats-card-${color}`}>
      {icon && <div className="stats-icon">{icon}</div>}
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export const StatsGrid = ({ stats }) => {
  return (
    <div className="admin-grid">
      {stats.map((stat, idx) => (
        <StatCard
          key={idx}
          number={stat.number}
          label={stat.label}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export const StatsTable = ({ columns, data, title }) => {
  return (
    <div className="stats-table-wrapper">
      {title && <h3 className="stats-table-title">{title}</h3>}
      <div className="stats-table-container">
        <table className="stats-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`col-${col.key}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td
                    key={`${idx}-${col.key}`}
                    className={`col-${col.key} ${col.align ? `text-${col.align}` : ''}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
