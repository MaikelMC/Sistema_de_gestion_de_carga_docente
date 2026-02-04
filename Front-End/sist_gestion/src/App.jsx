import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute } from './utils/ProtectedRoute';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsuarios } from './pages/admin/AdminUsuarios';
import { AdminRoles } from './pages/admin/AdminRoles';
import { AdminCambios } from './pages/admin/AdminCambios';
import { DirectorDashboard } from './pages/director/DirectorDashboard';
import { DirectorProfesores } from './pages/director/DirectorProfesores';
import { DirectorReportes } from './pages/director/DirectorReportes';
import { DirectorMensajes } from './pages/director/DirectorMensajes';
import { JefeDisciplinaDashboard } from './pages/jefe-disciplina/JefeDisciplinaDashboard';
import { JefeGestionProfesores } from './pages/jefe-disciplina/JefeGestionProfesores';
import { JefeMensajes } from './pages/jefe-disciplina/JefeMensajes';
import { VicedeanoDashboard } from './pages/vicedecano/VicedeanoDashboard';
import { VicedecanoGestion } from './pages/vicedecano/VicedecanoGestion';
import { VicedecanoReportes } from './pages/vicedecano/VicedecanoReportes';
import { VicedecanoMensajes } from './pages/vicedecano/VicedecanoMensajes';
import './styles/design-system.css';
import './App.css';
import './styles/forms.css';
import './styles/dashboard-common.css';
import './components/common/Layout.css';
import './components/common/Table.css';
import './components/common/SearchFilter.css';
import './components/common/Statistics.css';
import './components/common/Tabs.css';
import './components/auth/Auth.css';
import './pages/admin/Dashboard.css';
import './pages/director/Dashboard.css';
import './pages/director/DirectorViews.css';

const DashboardRouter = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'director':
      return <DirectorDashboard />;
    case 'jefe_disciplina':
      return <JefeDisciplinaDashboard />;
    case 'jefe_departamento':
      return <JefeDisciplinaDashboard />;
    case 'vicedecano':
      return <VicedeanoDashboard />;
    default:
      return <AdminDashboard />;
  }
};

const UnauthorizedPage = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', backgroundColor: '#f5f7fa' }}>
    <h1 style={{ color: '#0052cc' }}>Acceso Denegado</h1>
    <p style={{ color: '#666' }}>No tienes permiso para acceder a esta página</p>
    <a href="/dashboard" style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 'bold' }}>← Volver al Dashboard</a>
  </div>
);

const NotFoundPage = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', backgroundColor: '#f5f7fa' }}>
    <h1 style={{ color: '#0052cc' }}>404 - Página No Encontrada</h1>
    <p style={{ color: '#666' }}>La página que buscas no existe</p>
    <a href="/" style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 'bold' }}>← Ir al inicio</a>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardRouter />
        </ProtectedRoute>
      } />

      {/* Director routes */}
      <Route path="/director/profesores" element={
        <ProtectedRoute allowedRoles={['director']}>
          <DirectorProfesores />
        </ProtectedRoute>
      } />
      <Route path="/director/reportes" element={
        <ProtectedRoute allowedRoles={['director']}>
          <DirectorReportes />
        </ProtectedRoute>
      } />
      <Route path="/director/mensajes" element={
        <ProtectedRoute allowedRoles={['director']}>
          <DirectorMensajes />
        </ProtectedRoute>
      } />

      {/* Jefe routes */}
      <Route path="/jefe/gestion" element={
        <ProtectedRoute allowedRoles={['jefe_disciplina','jefe_departamento']}>
          <JefeGestionProfesores />
        </ProtectedRoute>
      } />
      <Route path="/jefe/mensajes" element={
        <ProtectedRoute allowedRoles={['jefe_disciplina','jefe_departamento']}>
          <JefeMensajes />
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin/usuarios" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminUsuarios />
        </ProtectedRoute>
      } />
      <Route path="/admin/roles" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminRoles />
        </ProtectedRoute>
      } />
      <Route path="/admin/cambios" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminCambios />
        </ProtectedRoute>
      } />

      {/* Vicedecano routes */}
      <Route path="/vicedecano/gestion" element={
        <ProtectedRoute allowedRoles={['vicedecano']}>
          <VicedecanoGestion />
        </ProtectedRoute>
      } />
      <Route path="/vicedecano/reportes" element={
        <ProtectedRoute allowedRoles={['vicedecano']}>
          <VicedecanoReportes />
        </ProtectedRoute>
      } />
      <Route path="/vicedecano/mensajes" element={
        <ProtectedRoute allowedRoles={['vicedecano']}>
          <VicedecanoMensajes />
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}
