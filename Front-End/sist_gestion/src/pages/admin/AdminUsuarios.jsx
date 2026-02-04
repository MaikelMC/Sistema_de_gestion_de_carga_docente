import React from 'react';
import { MainLayout } from '../../components/common/Layout';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

export const AdminUsuarios = () => {
  const [users] = React.useState([
    { id: 1, name: 'Juan García', email: 'juan@uci.edu.cu', role: 'jefe_disciplina', status: 'active' },
    { id: 2, name: 'María López', email: 'maria@uci.edu.cu', role: 'director', status: 'active' },
    { id: 3, name: 'Carlos Martínez', email: 'carlos@uci.edu.cu', role: 'vicedecano', status: 'blocked' },
  ]);

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { id: 'usuarios', icon: '👥', label: 'Gestionar Usuarios', href: '/admin/usuarios' },
    { id: 'roles', icon: '🔑', label: 'Roles y Permisos', href: '/admin/roles' },
    { id: 'cambios', icon: '🔐', label: 'Registro de Cambios', href: '/admin/cambios' },
  ];

  const roleLabels = {
    admin: 'Administrador',
    director: 'Director',
    jefe_disciplina: 'Jefe Disciplina',
    jefe_departamento: 'Jefe Departamento',
    vicedecano: 'Vicedecano'
  };

  return (
    <MainLayout sidebarItems={sidebarItems}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestionar Usuarios</h1>
          <p className="page-subtitle">Visualiza y administra todos los usuarios del sistema</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">+ Agregar Usuario</button>
        </div>
      </div>

      <div className="section">
        <h2>Listado de Usuarios</h2>
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{roleLabels[user.role]}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? 'Activo' : 'Bloqueado'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action">✏️</button>
                    <button className="btn-action">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminUsuarios;
