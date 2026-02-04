# 🔗 INTEGRACIÓN CON BACKEND - Guía Paso a Paso

## Situación Actual
- ✅ Frontend: 100% funcional con datos mock
- ❌ Backend: No existe
- ❌ Base de datos: No existe
- ❌ API: No está integrada

---

## Estructura de Carpetas para Integración

```
src/
├── services/
│   ├── api.js                    ← Configuración axios (CREAR)
│   ├── authService.js            ← Llamadas auth (CREAR)
│   ├── professorService.js        ← Llamadas profesores (CREAR)
│   ├── disciplineService.js       ← Llamadas disciplinas (CREAR)
│   └── commentService.js          ← Llamadas comentarios (CREAR)
│
├── context/
│   ├── AuthContext.jsx           ← Modificar para usar API
│   ├── DataContext.jsx           ← Modificar para usar API
│   └── ErrorContext.jsx          ← Crear para manejar errores
│
└── config/
    └── api.config.js             ← URLs y configuración
```

---

## PASO 1: Crear Archivo de Configuración API

**Archivo**: `src/services/api.js`

```javascript
import axios from 'axios';
import Cookies from 'js-cookie';

// URL base del backend - Cambiar según tu servidor
const BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('user');
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## PASO 2: Crear Servicios Específicos

### **authService.js**
```javascript
import api from './api';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Registro
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Verificar sesión
  verifySession: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  }
};
```

### **professorService.js**
```javascript
import api from './api';

export const professorService = {
  // Obtener todos los profesores
  getAll: async () => {
    const response = await api.get('/professors');
    return response.data;
  },

  // Obtener por ID
  getById: async (id) => {
    const response = await api.get(`/professors/${id}`);
    return response.data;
  },

  // Crear profesor
  create: async (professorData) => {
    const response = await api.post('/professors', professorData);
    return response.data;
  },

  // Actualizar profesor
  update: async (id, professorData) => {
    const response = await api.put(`/professors/${id}`, professorData);
    return response.data;
  },

  // Eliminar profesor
  delete: async (id) => {
    const response = await api.delete(`/professors/${id}`);
    return response.data;
  },

  // Filtrar por disciplina
  getByDiscipline: async (disciplineName) => {
    const response = await api.get(`/professors/discipline/${disciplineName}`);
    return response.data;
  },

  // Filtrar por facultad
  getByFaculty: async (facultyName) => {
    const response = await api.get(`/professors/faculty/${facultyName}`);
    return response.data;
  }
};
```

### **commentService.js**
```javascript
import api from './api';

export const commentService = {
  // Obtener todos los comentarios
  getAll: async () => {
    const response = await api.get('/comments');
    return response.data;
  },

  // Crear comentario
  create: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  // Obtener por tipo (agregar, editar, eliminar)
  getByType: async (type) => {
    const response = await api.get(`/comments/type/${type}`);
    return response.data;
  }
};
```

---

## PASO 3: Modificar AuthContext para usar API

**Archivo**: `src/context/AuthContext.jsx`

**Cambio**: Reemplazar login mock por API

```javascript
import { authService } from '../services/authService';

// ANTES (mock):
const login = async (email, password) => {
  setLoading(true);
  const mockUsers = { ... };
  if (mockUsers[email] && password === '123456') {
    const userData = mockUsers[email];
    setUser(userData);
    Cookies.set('user', JSON.stringify(userData));
    return userData;
  }
};

// DESPUÉS (API real):
const login = async (email, password) => {
  setLoading(true);
  setError(null);
  try {
    const response = await authService.login(email, password);
    const { user, token } = response;
    
    setUser(user);
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
    Cookies.set('token', token, { expires: 7 });
    return user;
  } catch (err) {
    setError(err.response?.data?.message || 'Error al iniciar sesión');
    throw err;
  } finally {
    setLoading(false);
  }
};
```

---

## PASO 4: Modificar DataContext para usar API

**Archivo**: `src/context/DataContext.jsx`

```javascript
import { useEffect } from 'react';
import { professorService } from '../services/professorService';
import { commentService } from '../services/commentService';

// ANTES: useState con datos mock
const [professors, setProfessors] = useState([...mockData]);

// DESPUÉS: useEffect que llama a API
useEffect(() => {
  loadProfessors();
}, []);

const loadProfessors = async () => {
  try {
    const data = await professorService.getAll();
    setProfessors(data);
  } catch (err) {
    console.error('Error cargando profesores:', err);
  }
};

// Actualizar CRUD para usar API
const addProfessor = async (professor) => {
  try {
    const newProf = await professorService.create(professor);
    setProfessors([...professors, newProf]);
    return newProf;
  } catch (err) {
    throw new Error('Error al agregar profesor');
  }
};

const updateProfessor = async (id, updates) => {
  try {
    await professorService.update(id, updates);
    setProfessors(professors.map(p =>
      p.id === id ? { ...p, ...updates } : p
    ));
  } catch (err) {
    throw new Error('Error al actualizar profesor');
  }
};

const deleteProfessor = async (id) => {
  try {
    await professorService.delete(id);
    setProfessors(professors.filter(p => p.id !== id));
  } catch (err) {
    throw new Error('Error al eliminar profesor');
  }
};

// Similar para comentarios y disciplinas...
```

---

## PASO 5: Variables de Entorno

**Archivo**: `.env` (crear en raíz del proyecto)

```env
# Backend API
VITE_API_URL=http://localhost:3000/api

# O para producción:
# VITE_API_URL=https://api.tudominio.com/api

# Otros
VITE_APP_NAME=SGCD
VITE_APP_VERSION=1.0.0
```

**Archivo**: `.env.development`

```env
VITE_API_URL=http://localhost:3000/api
VITE_DEBUG=true
```

**Archivo**: `.env.production`

```env
VITE_API_URL=https://api.production.com/api
VITE_DEBUG=false
```

---

## PASO 6: Estructura de Respuestas API Esperada

### Login
```javascript
POST /auth/login
Request: { email: string, password: string }
Response: {
  success: true,
  data: {
    user: {
      id: number,
      name: string,
      email: string,
      role: string,
      department?: string
    },
    token: string
  }
}
```

### Get Professors
```javascript
GET /professors
Response: {
  success: true,
  data: [
    {
      id: number,
      name: string,
      email: string,
      department: string,
      subjects: string[],
      faculty: string,
      createdAt: datetime
    }
  ]
}
```

### Create Professor
```javascript
POST /professors
Request: {
  name: string,
  email: string,
  department: string,
  subjects: string[],
  faculty: string
}
Response: {
  success: true,
  data: {
    id: number,
    name: string,
    email: string,
    department: string,
    subjects: string[],
    faculty: string,
    createdAt: datetime
  },
  message: string
}
```

---

## PASO 7: Manejo de Errores

```javascript
// En cualquier componente que use los servicios:
import { useData } from '../context/DataContext';

const { professors } = useData();

const handleAddProfessor = async (formData) => {
  try {
    await addProfessor(formData);
    setAlert({ type: 'success', message: 'Profesor agregado' });
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    setAlert({ type: 'error', message });
  }
};
```

---

## Checklist de Integración

- [ ] Crear archivo `src/services/api.js`
- [ ] Crear archivo `src/services/authService.js`
- [ ] Crear archivo `src/services/professorService.js`
- [ ] Crear archivo `src/services/commentService.js`
- [ ] Crear archivo `src/services/disciplineService.js`
- [ ] Actualizar `src/context/AuthContext.jsx`
- [ ] Actualizar `src/context/DataContext.jsx`
- [ ] Crear archivo `.env`
- [ ] Probar login con API
- [ ] Probar CRUD de profesores
- [ ] Probar filtros
- [ ] Probar descargas CSV
- [ ] Implementar manejo de errores
- [ ] Agregar loading states
- [ ] Probar en producción

---

## Backend Recomendado

### Opción 1: Node.js + Express
```bash
npm install express cors dotenv
```

### Opción 2: Python + Flask
```bash
pip install flask flask-cors python-dotenv
```

### Opción 3: Java + Spring Boot
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

---

## Comandos para Desarrollo

```bash
# Instalar dependencias (si no las tienes)
npm install

# Iniciar frontend
npm run dev

# Backend en otra terminal
# (según tu framework)
node server.js
# python app.py
# mvn spring-boot:run

# Abrir en navegador
# http://localhost:5173
```

---

**Estado**: El frontend está completamente listo para integración
**Próximo paso**: Desarrollar el backend siguiendo esta guía

