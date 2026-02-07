import { useState, useEffect } from 'react';

/**
 * Hook para manejar notificaciones toast
 */
export const useToasts = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev].slice(-2).concat([{ id, message, type, duration }]));
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showSuccess = (message, duration = 4000) => addToast(message, 'success', duration);
  const showError = (message, duration = 5000) => addToast(message, 'error', duration);
  const showWarning = (message, duration = 4000) => addToast(message, 'warning', duration);
  const showInfo = (message, duration = 4000) => addToast(message, 'info', duration);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

/**
 * Hook para manejar diálogos de confirmación
 */
export const useConfirm = () => {
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    type: 'warning',
    onConfirm: null,
    onCancel: null,
  });

  const confirm = (options, callback) => {
    // Soporte para dos formas de llamar
    // Forma 1: confirm(options = {title, message, ...}, callback)
    // Forma 2: confirm(message, callback)
    let config = {};
    let done = callback;

    if (typeof options === 'string') {
      config = {
        title: '¿Está seguro?',
        message: options,
      };
    } else {
      config = options;
    }
    if (typeof callback === 'function') {
      done = callback;
    }

    setConfirmDialog({
      isOpen: true,
      title: config.title || '¿Está seguro?',
      message: config.message || '',
      confirmText: config.confirmText || 'Continuar',
      cancelText: config.cancelText || 'Cancelar',
      type: config.type || 'warning',
      onConfirm: () => {
        if (done) done(true);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        if (done) done(false);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  return {
    confirmDialog,
    confirm,
  };
};
