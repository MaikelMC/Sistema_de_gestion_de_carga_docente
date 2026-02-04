import React from 'react';
import { MainLayout } from '../../components/common/Layout';
import './Dashboard.css';

export const AdminRoles = () => {
  const roles = [
    {
      name: 'Administrador',
      permisos: ['Gestionar usuarios', 'Asignar roles', 'Ver reportes globales', 'Configurar sistema']
    },
    {
      name: 'Director de Formación',
      permisos: ['Ver profesores', 'Generar reportes', 'Ver mensajes', 'Buscar profesores']
    },
    {
      name: 'Jefe de Disciplina',
      permisos: ['Gestionar profesores', 'Ver mensajes', 'Editar profesores', 'Eliminar profesores']
    },
    {
      name: 'Vicedecano de Formación',
      permisos: ['Gestionar profesores', 'Descargar reportes', 'Ver mensajes', 'Estadísticas completas']
    }
  ];

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'usuarios', icon: '👥', label: 'Gestionar Usuarios', href: '/admin/usuarios' },
    { id: 'roles', icon: '🔑', label: 'Roles y Permisos', href: '/admin/roles' },
    { id: 'cambios', icon: '🔐', label: 'Registro de Cambios', href: '/admin/cambios' },
  ];

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Roles y Permisos</h1>
          <p className="page-subtitle">Visualiza los permisos asignados a cada rol</p>
        </div>
      </div>

      <div className="roles-grid">
        {roles.map((role, idx) => (
          <div key={idx} className="role-card">
            <div className="role-title">{role.name}</div>
            <div className="role-permisos">
              {role.permisos.map((permiso, pidx) => (
                <div key={pidx} className="permiso-item">
                  <span className="permiso-check">✓</span>
                  {permiso}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default AdminRoles;
