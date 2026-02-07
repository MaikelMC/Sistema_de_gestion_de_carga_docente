import React, { createContext, useContext } from 'react';
import { useToasts, useConfirm } from '../components/common/NotificationHooks';
import { ToastContainer, ConfirmDialog } from '../components/common/Notifications';

// Contexto global para notificaciones
const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const toasts = useToasts();
  const confirmDialog = useConfirm();

  const value = {
    ...toasts,
    confirm: confirmDialog.confirm,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts.toasts} removeToast={toasts.removeToast} />
      <ConfirmDialog {...confirmDialog.confirmDialog} />
    </NotificationContext.Provider>
  );
};
