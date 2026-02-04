# Sistema de Gestión de Carga Docente - Frontend

## 📋 Descripción

Sistema web profesional para la gestión de carga docente de la Universidad de Ciencias Informáticas (UCI). Permite a los diferentes roles de usuarios (Administrador, Director, Jefes de Disciplina, Jefes de Departamento y Vicedecano) gestionar profesores, asignaturas y disciplinas de forma centralizada.

## 🎨 Características Principales

### ✨ Diseño
- **CSS Puro**: Sin Tailwind CSS ni frameworks CSS
- **Tema Profesional**: Colores azul y blanco
- **Responsive**: Totalmente adaptable a dispositivos móviles
- **Accesible**: Cumple con estándares WCAG

### 🔐 Autenticación
- Login y Registro de usuarios
- Gestión de roles y permisos
- Autenticación con cookies
- Rutas protegidas

### 👥 Roles y Funcionalidades

#### Administrador
- Gestión completa de usuarios
- Asignar y modificar roles
- Bloquear/desbloquear usuarios
- Cambio de contraseñas

#### Director de Formación
- Ver profesores por facultad y asignatura
- Descargar reportes en CSV
- Visualizar mensajes de modificaciones

#### Jefe de Disciplina / Jefe de Departamento
- Agregar y editar profesores
- Asignar profesores a disciplinas y asignaturas
- Dejar comentarios obligatorios en cada cambio
- Ver sus propias modificaciones

#### Vicedecano de Formación
- Acceso completo a todas las disciplinas
- Crear y editar profesores
- Descargar reportes por múltiples filtros
- Ver registro completo de cambios

## 🚀 Instalación

### Requisitos
- Node.js v18+
- npm o yarn

### Pasos

```bash
# 1. Clonar o descargar el proyecto
cd sist_gestion

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

## 📚 Estructura del Proyecto

```
sist_gestion/
├── src/
│   ├── components/
│   │   ├── auth/          # Componentes de autenticación
│   │   └── common/        # Componentes reutilizables
│   ├── pages/
│   │   ├── admin/         # Dashboard del Administrador
│   │   ├── director/      # Dashboard del Director
│   │   ├── jefe-disciplina/  # Dashboard del Jefe
│   │   └── vicedecano/    # Dashboard del Vicedecano
│   ├── context/           # Context API
│   ├── services/          # Servicios (APIs, etc)
│   ├── utils/             # Utilidades y funciones
│   ├── styles/            # CSS global
│   └── App.jsx            # Componente raíz
├── index.html
├── package.json
└── vite.config.js
```

## 🔑 Credenciales de Prueba

```
Administrador:
- Email: admin@uci.edu.cu
- Contraseña: 123456

Director:
- Email: director@uci.edu.cu
- Contraseña: 123456

Jefe de Disciplina:
- Email: jefe@uci.edu.cu
- Contraseña: 123456

Vicedecano:
- Email: vicedecano@uci.edu.cu
- Contraseña: 123456
```

## 🛠️ Tecnologías Utilizadas

- **React 19**: Framework JavaScript
- **React Router v6**: Enrutamiento
- **Vite**: Bundler y servidor de desarrollo
- **JavaScript ES6+**: Lenguaje
- **CSS3**: Estilos puros
- **js-cookie**: Manejo de cookies

## 📦 Dependencias Principales

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "js-cookie": "^3.x"
}
```

## 🎯 Funcionalidades por Módulo

### 1. **Autenticación**
- ✅ Login seguro
- ✅ Registro de usuarios
- ✅ Rutas protegidas
- ✅ Rol-based access control (RBAC)

### 2. **Gestión de Profesores**
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Filtrado por disciplina, facultad, asignatura
- ✅ Búsqueda y paginación

### 3. **Reportes**
- ✅ Exportación a CSV
- ✅ Múltiples opciones de filtrado
- ✅ Descarga por roles y permisos

### 4. **Sistema de Mensajes**
- ✅ Comentarios obligatorios en cambios
- ✅ Registro de modificaciones
- ✅ Visualización por roles

## 🎨 Esquema de Colores

- **Primario**: #0052cc (Azul profundo)
- **Primario Oscuro**: #003d99
- **Éxito**: #28a745 (Verde)
- **Peligro**: #dc3545 (Rojo)
- **Advertencia**: #ffc107 (Amarillo)
- **Fondo**: #f5f7fa (Gris claro)
- **Texto**: #333 (Gris oscuro)
- **Blanco**: #ffffff

## 📱 Responsive Design

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 🔒 Seguridad

- Autenticación con tokens
- Protección de rutas
- Validación de inputs
- CSRF protection (mediante cookies)

## 📊 Estadísticas Soportadas

- Total de profesores
- Profesores por disciplina
- Profesores por facultad
- Usuarios activos/bloqueados
- Cambios registrados

## 🚢 Build y Deploy

```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📝 Notas para Desarrollo

### Agregar un nuevo rol
1. Actualizar `AuthContext.jsx` con las credenciales mock
2. Crear nuevo dashboard en `src/pages/nuevo-rol/`
3. Agregar ruta en `App.jsx` en el `DashboardRouter`

### Agregar nuevos estilos
1. Crear archivo CSS en `src/styles/` o junto al componente
2. Importar en el componente correspondiente
3. Mantener consistencia con el esquema de colores

### Integración con Backend
1. Reemplazar llamadas mock en `AuthContext.jsx` y `DataContext.jsx`
2. Usar axios en `src/services/` para llamadas HTTP
3. Configurar endpoints en `vite.config.js`

## 🤝 Contribución

Para contribuir al proyecto:
1. Crear una rama `feature/nombre-feature`
2. Hacer commit de los cambios
3. Enviar pull request

## 📞 Soporte

Para soporte técnico, contactar a:
- Email: soporte@uci.edu.cu
- Teléfono: +53 (7) XXXX-XXXX

## 📄 Licencia

Este proyecto es propiedad de la Universidad de Ciencias Informáticas (UCI).

## ✅ Checklist de Características

- [x] Autenticación y Login
- [x] RBAC (Roles Based Access Control)
- [x] Dashboard por rol
- [x] Gestión de profesores
- [x] Gestión de usuarios (Admin)
- [x] Sistema de mensajes/comentarios
- [x] Exportación a CSV
- [x] Diseño responsivo
- [x] CSS puro (Azul y Blanco)
- [x] Validaciones de formularios
- [x] Rutas protegidas
- [ ] Backend API integration
- [ ] Autenticación OAuth/JWT
- [ ] Tests unitarios
- [ ] E2E tests

---

**Desarrollado con ❤️ para UCI**
