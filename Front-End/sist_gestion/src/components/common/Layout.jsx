import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = () => {
    const labels = {
      admin: 'Administrador',
      director: 'Director de Formación',
      jefe_disciplina: 'Jefe de Disciplina',
      jefe_departamento: 'Jefe de Departamento',
      vicedecano: 'Vicedecano de Formación'
    };
    return labels[user?.role] || user?.role;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">SGCD</h1>
          <p className="app-subtitle">Sistema de Gestión de Carga Docente</p>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{getRoleLabel()}</span>
          </div>

          <div className="user-menu">
            <button
              className="menu-button"
              onClick={() => setShowMenu(!showMenu)}
              title="Opciones de usuario"
            >
              ⋮
            </button>

            {showMenu && (
              <div className="dropdown-menu">
                <button className="menu-item">Perfil</button>
                <button className="menu-item">Cambiar contraseña</button>
                <button className="menu-item logout-item" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export const Sidebar = ({ items, collapsed = false, onToggle }) => {
  const location = useLocation();

  // Determina si un item está activo comparando la ruta actual
  const isItemActive = (href) => {
    // Para la ruta dashboard
    if (href === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    // Para rutas de director
    if (href !== '/dashboard' && location.pathname.startsWith(href)) {
      return true;
    }
    return false;
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="toggle-sidebar" onClick={onToggle}>
        {collapsed ? '→' : '←'}
      </button>

      <nav className="sidebar-nav">
        {items.map(item => (
          <Link
            key={item.id}
            to={item.href}
            className={`nav-item ${isItemActive(item.href) ? 'active' : ''}`}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export const MainLayout = ({ children, sidebarItems }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Header />
      <div className="layout-container">
        <Sidebar
          items={sidebarItems}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
