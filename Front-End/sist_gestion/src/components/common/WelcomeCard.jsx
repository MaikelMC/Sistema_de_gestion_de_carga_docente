import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../admin/Dashboard.css';

export const WelcomeCard = () => {
  const { user } = useAuth();

  const getRoleMessage = () => {
    const messages = {
      admin: 'Bienvenido Administrador. Desde aquí puedes gestionar usuarios y roles del sistema.',
      director: 'Bienvenido Director. Aquí puedes visualizar los datos de profesores y descargar reportes.',
      jefe_disciplina: 'Bienvenido Jefe de Disciplina. Administra los profesores de tu disciplina.',
      jefe_departamento: 'Bienvenido Jefe de Departamento. Administra los profesores del departamento.',
      vicedecano: 'Bienvenido Vicedecano. Tienes acceso completo a todas las disciplinas y facultades.'
    };
    return messages[user?.role] || 'Bienvenido al Sistema';
  };

  const getRoleIcon = () => {
    const icons = {
      admin: '⚙️',
      director: '📊',
      jefe_disciplina: '👨‍🏫',
      jefe_departamento: '🏢',
      vicedecano: '🎓'
    };
    return icons[user?.role] || '👋';
  };

  return (
    <div className="section" style={{ marginBottom: '30px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0052cc 0%, #003d99 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '48px' }}>{getRoleIcon()}</div>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
              Hola {user?.name}
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
              {getRoleMessage()}
            </p>
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ color: '#0052cc', marginTop: 0 }}>Información del Sistema</h3>
        <ul style={{ color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
          <li>Universidad: Universidad de Ciencias Informáticas (UCI)</li>
          <li>Sistema: Gestión de Carga Docente</li>
          <li>Tu Rol: {user?.role?.replace(/_/g, ' ')}</li>
          {user?.department && <li>Departamento: {user.department}</li>}
          <li>Conectado como: {user?.email}</li>
        </ul>
      </div>
    </div>
  );
};
