import React from 'react';
import './Table.css';

export const Table = ({ columns, data, onEdit, onDelete, loading = false }) => {
  if (loading) {
    return <div className="table-loading">Cargando datos...</div>;
  }

  if (data.length === 0) {
    return <div className="table-empty">No hay datos disponibles</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key= {`${col.key}`} className={`col-${col.key}`}>
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="col-actions">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map(col => (
                <td key={`${row.id}-${col.key}`} className={`col-${col.key}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="col-actions">
                  <div className="actions">
                    {onEdit && (
                      <button
                        className="action-btn edit-btn"
                        onClick={() => onEdit(row)}
                        title="Editar"
                      >
                        ✎
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(row.id)}
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Guardar' }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-content">
          {children}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
};

export const Alert = ({ type = 'info', message, onClose }) => {
  const alertType = type === 'error' ? 'danger' : type;

  return (
    <div className={`alert alert-${alertType}`}>
      <span>{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose}>✕</button>
      )}
    </div>
  );
};
