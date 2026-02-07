import React, { useState, useEffect } from 'react';
import './Notifications.css';

/**
 * Componente Toast para notificaciones temporales
 * Se cierra automáticamente o manualmente
 */
export const Toast = ({ type = 'info', message, onClose, duration = 4000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast-notification toast-${type} ${isExiting ? 'toast-exiting' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={() => {
        setIsExiting(true);
        setTimeout(onClose, 300);
      }}>
        ✕
      </button>
    </div>
  );
};

/**
 * Contenedor para múltiples toasts
 * Mantiene un max de 3 notificaciones simultáneas
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

/**
 * Diálogo de confirmación personalizado
 * Reemplaza a confirm() del navegador
 */
export const ConfirmDialog = ({
  isOpen,
  title = '¿Está seguro?',
  message,
  confirmText = 'Continuar',
  cancelText = 'Cancelar',
  type = 'warning',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <div className={`confirm-dialog-icon confirm-dialog-${type}`}>
            {type === 'danger' ? '⚠' : type === 'success' ? '✓' : '?'}
          </div>
          <h2>{title}</h2>
        </div>
        <div className="confirm-dialog-content">
          <p>{message}</p>
        </div>
        <div className="confirm-dialog-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`btn btn-${type === 'danger' ? 'danger' : 'primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
};
