import axios from 'axios';
import Cookies from 'js-cookie';
import { CONFIG } from '../config';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: CONFIG.API.BASE_URL,
  timeout: CONFIG.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request: agregar token JWT a cada petición
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response: manejar errores y refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el token expiró, intentar refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${CONFIG.API.BASE_URL}/auth/refresh/`,
            { refresh: refreshToken }
          );
          const { access } = response.data;

          // Guardar nuevo token
          Cookies.set('token', access, { expires: 1 });

          // Reintentar la petición original
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar cookies y redirigir al login
        Cookies.remove('token');
        Cookies.remove('refresh_token');
        Cookies.remove('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login/', { email, password }),

  register: (data) =>
    api.post('/auth/register/', data),

  refreshToken: (refresh) =>
    api.post('/auth/refresh/', { refresh }),

  getProfile: () =>
    api.get('/auth/profile/'),

  updateProfile: (data) =>
    api.patch('/auth/profile/', data),

  changePassword: (data) =>
    api.put('/auth/change-password/', data),
};

// ==================== PROFESSORS API ====================
export const professorsAPI = {
  getAll: (params = {}) =>
    api.get('/professors/', { params }),

  getById: (id) =>
    api.get(`/professors/${id}/`),

  create: (data) =>
    api.post('/professors/', data),

  update: (id, data) =>
    api.put(`/professors/${id}/`, data),

  partialUpdate: (id, data) =>
    api.patch(`/professors/${id}/`, data),

  delete: (id) =>
    api.delete(`/professors/${id}/`),

  exportCSV: () =>
    api.get('/professors/export_csv/', { responseType: 'blob' }),

  getCategories: () =>
    api.get('/professors/categories/'),

  getScientificDegrees: () =>
    api.get('/professors/scientific_degrees/'),

  getContractTypes: () =>
    api.get('/professors/contract_types/'),
};

// ==================== ACADEMIC API ====================
export const academicAPI = {
  // Facultades
  getFaculties: (params = {}) =>
    api.get('/academic/faculties/', { params }),

  getFacultyById: (id) =>
    api.get(`/academic/faculties/${id}/`),

  createFaculty: (data) =>
    api.post('/academic/faculties/', data),

  updateFaculty: (id, data) =>
    api.put(`/academic/faculties/${id}/`, data),

  deleteFaculty: (id) =>
    api.delete(`/academic/faculties/${id}/`),

  // Disciplinas
  getDisciplines: (params = {}) =>
    api.get('/academic/disciplines/', { params }),

  getDisciplineById: (id) =>
    api.get(`/academic/disciplines/${id}/`),

  createDiscipline: (data) =>
    api.post('/academic/disciplines/', data),

  updateDiscipline: (id, data) =>
    api.put(`/academic/disciplines/${id}/`, data),

  deleteDiscipline: (id) =>
    api.delete(`/academic/disciplines/${id}/`),

  // Asignaturas
  getSubjects: (params = {}) =>
    api.get('/academic/subjects/', { params }),

  getSubjectById: (id) =>
    api.get(`/academic/subjects/${id}/`),

  createSubject: (data) =>
    api.post('/academic/subjects/', data),

  updateSubject: (id, data) =>
    api.put(`/academic/subjects/${id}/`, data),

  deleteSubject: (id) =>
    api.delete(`/academic/subjects/${id}/`),
};

// ==================== COMMENTS API ====================
export const commentsAPI = {
  getAll: (params = {}) =>
    api.get('/comments/', { params }),

  getById: (id) =>
    api.get(`/comments/${id}/`),

  create: (data) =>
    api.post('/comments/', data),

  update: (id, data) =>
    api.put(`/comments/${id}/`, data),

  delete: (id) =>
    api.delete(`/comments/${id}/`),

  markRead: (id) =>
    api.post(`/comments/${id}/mark_read/`),

  reply: (id, message) =>
    api.post(`/comments/${id}/reply/`, { message }),

  getUnread: () =>
    api.get('/comments/unread/'),

  getStatistics: () =>
    api.get('/comments/statistics/'),
};

// ==================== USERS API ====================
export const usersAPI = {
  getAll: (params = {}) =>
    api.get('/users/', { params }),

  getById: (id) =>
    api.get(`/users/${id}/`),

  create: (data) =>
    api.post('/users/', data),

  update: (id, data) =>
    api.put(`/users/${id}/`, data),

  partialUpdate: (id, data) =>
    api.patch(`/users/${id}/`, data),

  delete: (id) =>
    api.delete(`/users/${id}/`),

  block: (id) =>
    api.post(`/users/${id}/block/`),

  unblock: (id) =>
    api.post(`/users/${id}/unblock/`),

  changePassword: (id, data) =>
    api.post(`/users/${id}/change_password/`, data),

  getRoles: () =>
    api.get('/roles/'),
};

// ==================== ASSIGNMENTS API ====================
export const assignmentsAPI = {
  getAll: (params = {}) =>
    api.get('/assignments/', { params }),

  getById: (id) =>
    api.get(`/assignments/${id}/`),

  create: (data) =>
    api.post('/assignments/', data),

  update: (id, data) =>
    api.put(`/assignments/${id}/`, data),

  delete: (id) =>
    api.delete(`/assignments/${id}/`),

  exportCSV: () =>
    api.get('/assignments/export_csv/', { responseType: 'blob' }),

  getHistory: (id) =>
    api.get(`/assignments/${id}/history/`),

  getTypes: () =>
    api.get('/assignments/assignment_types/'),
};

export default api;
