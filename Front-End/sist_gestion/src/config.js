// Configuración del Sistema
// Este archivo contiene todas las constantes y configuraciones del sistema

export const CONFIG = {
  // API
  API: {
    BASE_URL: process.env.VITE_API_URL || 'http://localhost:3000/api',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3
  },

  // Autenticación
  AUTH: {
    TOKEN_KEY: 'app_token',
    USER_KEY: 'app_user',
    TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 horas
    REFRESH_TOKEN_KEY: 'app_refresh_token'
  },

  // Paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZES: [5, 10, 25, 50, 100]
  },

  // Rutas
  ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    ADMIN: '/admin',
    DIRECTOR: '/director',
    JEFE_DISCIPLINA: '/jefe-disciplina',
    VICEDECANO: '/vicedecano'
  },

  // Roles
  ROLES: {
    ADMIN: 'admin',
    DIRECTOR: 'director',
    JEFE_DISCIPLINA: 'jefe_disciplina',
    JEFE_DEPARTAMENTO: 'jefe_departamento',
    VICEDECANO: 'vicedecano'
  },

  // Permisos
  PERMISSIONS: {
    MANAGE_USERS: 'manage_users',
    MANAGE_ROLES: 'manage_roles',
    VIEW_PROFESSORS: 'view_professors',
    ADD_PROFESSOR: 'add_professor',
    EDIT_PROFESSOR: 'edit_professor',
    DELETE_PROFESSOR: 'delete_professor',
    DOWNLOAD_REPORTS: 'download_reports',
    VIEW_COMMENTS: 'view_comments',
    ADD_COMMENT: 'add_comment'
  },

  // Mensajes
  MESSAGES: {
    SUCCESS: {
      SAVE: 'Guardado exitosamente',
      DELETE: 'Eliminado exitosamente',
      UPDATE: 'Actualizado exitosamente',
      LOGIN: 'Bienvenido',
      LOGOUT: 'Sesión cerrada'
    },
    ERROR: {
      SAVE: 'Error al guardar',
      DELETE: 'Error al eliminar',
      UPDATE: 'Error al actualizar',
      LOGIN: 'Error al iniciar sesión',
      NETWORK: 'Error de conexión',
      VALIDATION: 'Por favor completa todos los campos',
      UNAUTHORIZED: 'No estás autorizado'
    },
    INFO: {
      LOADING: 'Cargando...',
      NO_DATA: 'No hay datos disponibles',
      CONFIRM_DELETE: '¿Estás seguro de que deseas eliminar?'
    }
  },

  // Colores
  COLORS: {
    PRIMARY: '#0052cc',
    PRIMARY_DARK: '#003d99',
    SUCCESS: '#28a745',
    DANGER: '#dc3545',
    WARNING: '#ffc107',
    INFO: '#17a2b8',
    LIGHT: '#f5f7fa',
    DARK: '#333',
    WHITE: '#ffffff',
    BORDER: '#e0e0e0'
  },

  // Disciplinas
  DISCIPLINES: [
    { id: 1, name: 'Programación' },
    { id: 2, name: 'Base de Datos' },
    { id: 3, name: 'Sistemas' },
    { id: 4, name: 'Redes' },
    { id: 5, name: 'Seguridad' },
    { id: 6, name: 'Web' }
  ],

  // Facultades
  FACULTIES: [
    'Ingeniería Informática',
    'Ingeniería en Ciencias Informáticas',
    'Ciencias'
  ],

  // Asignaturas ejemplo
  SUBJECTS: [
    'Python',
    'Java',
    'JavaScript',
    'C++',
    'SQL',
    'Arquitectura de Software',
    'Programación Web',
    'Bases de Datos Avanzadas',
    'Sistemas Operativos',
    'Redes de Computadoras'
  ],

  // Validaciones
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_NAME_LENGTH: 100,
    MIN_EMAIL_LENGTH: 5,
    MAX_EMAIL_LENGTH: 100
  },

  // Storage
  STORAGE: {
    PREFIX: 'sgcd_',
    USER_KEY: 'sgcd_user',
    TOKEN_KEY: 'sgcd_token',
    THEME_KEY: 'sgcd_theme'
  },

  // Feature Flags
  FEATURES: {
    ENABLE_EXPORT_CSV: true,
    ENABLE_EXPORT_JSON: false,
    ENABLE_EXPORT_EXCEL: false,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_TWO_FACTOR: false,
    ENABLE_AUDIT_LOG: true,
    ENABLE_ADVANCED_FILTERS: true
  },

  // Límites
  LIMITS: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_UPLOAD_FILES: 10,
    SEARCH_MIN_LENGTH: 2,
    API_RATE_LIMIT: 100 // requests per minute
  },

  // Formato de datos
  FORMATS: {
    DATE: 'DD/MM/YYYY',
    TIME: 'HH:mm',
    DATETIME: 'DD/MM/YYYY HH:mm',
    PHONE: '+53 (X) XXXX-XXXX'
  },

  // Universidad
  UNIVERSITY: {
    NAME: 'Universidad de Ciencias Informáticas',
    ACRONYM: 'UCI',
    LOCATION: 'La Habana, Cuba',
    EMAIL: 'info@uci.edu.cu',
    PHONE: '+53 (7) 8385500',
    WEBSITE: 'https://www.uci.cu'
  }
};

// Mapeador de roles a permisos
export const ROLE_PERMISSIONS = {
  [CONFIG.ROLES.ADMIN]: [
    CONFIG.PERMISSIONS.MANAGE_USERS,
    CONFIG.PERMISSIONS.MANAGE_ROLES,
    CONFIG.PERMISSIONS.VIEW_PROFESSORS,
    CONFIG.PERMISSIONS.ADD_PROFESSOR,
    CONFIG.PERMISSIONS.EDIT_PROFESSOR,
    CONFIG.PERMISSIONS.DELETE_PROFESSOR
  ],
  [CONFIG.ROLES.DIRECTOR]: [
    CONFIG.PERMISSIONS.VIEW_PROFESSORS,
    CONFIG.PERMISSIONS.DOWNLOAD_REPORTS,
    CONFIG.PERMISSIONS.VIEW_COMMENTS
  ],
  [CONFIG.ROLES.JEFE_DISCIPLINA]: [
    CONFIG.PERMISSIONS.VIEW_PROFESSORS,
    CONFIG.PERMISSIONS.ADD_PROFESSOR,
    CONFIG.PERMISSIONS.EDIT_PROFESSOR,
    CONFIG.PERMISSIONS.DELETE_PROFESSOR,
    CONFIG.PERMISSIONS.ADD_COMMENT
  ],
  [CONFIG.ROLES.JEFE_DEPARTAMENTO]: [
    CONFIG.PERMISSIONS.VIEW_PROFESSORS,
    CONFIG.PERMISSIONS.ADD_PROFESSOR,
    CONFIG.PERMISSIONS.EDIT_PROFESSOR,
    CONFIG.PERMISSIONS.DELETE_PROFESSOR,
    CONFIG.PERMISSIONS.ADD_COMMENT
  ],
  [CONFIG.ROLES.VICEDECANO]: [
    CONFIG.PERMISSIONS.VIEW_PROFESSORS,
    CONFIG.PERMISSIONS.ADD_PROFESSOR,
    CONFIG.PERMISSIONS.EDIT_PROFESSOR,
    CONFIG.PERMISSIONS.DELETE_PROFESSOR,
    CONFIG.PERMISSIONS.DOWNLOAD_REPORTS,
    CONFIG.PERMISSIONS.VIEW_COMMENTS,
    CONFIG.PERMISSIONS.ADD_COMMENT
  ]
};

// Funciones de utilidad
export const hasPermission = (userRole, permission) => {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};

export const canManageProfessors = (userRole) => {
  return hasPermission(userRole, CONFIG.PERMISSIONS.EDIT_PROFESSOR);
};

export const canDownloadReports = (userRole) => {
  return hasPermission(userRole, CONFIG.PERMISSIONS.DOWNLOAD_REPORTS);
};

export const canViewComments = (userRole) => {
  return hasPermission(userRole, CONFIG.PERMISSIONS.VIEW_COMMENTS);
};

export default CONFIG;
