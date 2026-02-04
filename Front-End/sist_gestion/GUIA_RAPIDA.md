# 🚀 Guía Rápida - Sistema de Gestión de Carga Docente

## 🏃‍♂️ Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar desarrollo
npm run dev

# 3. Abrir navegador en http://localhost:5173
```

## 🔑 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@uci.edu.cu | 123456 |
| Director | director@uci.edu.cu | 123456 |
| Jefe Disciplina | jefe@uci.edu.cu | 123456 |
| Vicedecano | vicedecano@uci.edu.cu | 123456 |

## 📁 Archivos Principales

```
src/
├── App.jsx                    # Punto de entrada
├── App.css                    # Estilos globales
├── index.css                  # CSS base
│
├── components/
│   ├── auth/
│   │   ├── LoginPage.jsx      # Página de login
│   │   ├── RegisterPage.jsx   # Página de registro
│   │   └── Auth.css           # Estilos auth
│   │
│   └── common/
│       ├── Layout.jsx         # Header, Sidebar, MainLayout
│       ├── Layout.css         # Estilos layout
│       ├── Table.jsx          # Tabla, Modal, Alert
│       ├── Table.css          # Estilos tabla
│       └── WelcomeCard.jsx    # Bienvenida
│
├── pages/
│   ├── admin/AdminDashboard.jsx
│   ├── director/DirectorDashboard.jsx
│   ├── jefe-disciplina/JefeDisciplinaDashboard.jsx
│   ├── vicedecano/VicedeanoDashboard.jsx
│   └── admin/Dashboard.css    # Estilos compartidos
│
├── context/
│   ├── AuthContext.jsx        # Autenticación
│   └── DataContext.jsx        # Datos de profesores, etc
│
├── utils/
│   ├── ProtectedRoute.jsx     # Rutas protegidas
│   └── helpers.js             # Funciones utilitarias
│
└── styles/
    └── forms.css              # Estilos de formularios
```

## 🎨 Esquema de Colores

```css
--primary: #0052cc        /* Azul principal */
--primary-dark: #003d99   /* Azul oscuro */
--success: #28a745        /* Verde */
--danger: #dc3545         /* Rojo */
--warning: #ffc107        /* Amarillo */
--light: #f5f7fa          /* Gris claro */
--dark: #333              /* Gris oscuro */
--white: #ffffff          /* Blanco */
--border: #e0e0e0         /* Gris borde */
```

## 💡 Tarea: Agregar Nueva Funcionalidad

### Agregar un nuevo campo a Profesor

1. **En `context/DataContext.jsx`**: Agregar campo a `mockData`
2. **En `pages/*/Dashboard.jsx`**: Agregar campo en el formulario modal
3. **En tabla**: Agregar columna en definición de columns

### Ejemplo:
```javascript
// DataContext.jsx
{
  id: 1,
  name: 'Dr. Juan García',
  phone: '+53 7 1234 5678',  // ← Nuevo campo
  // ...
}

// Dashboard.jsx
<div className="form-group">
  <label>Teléfono</label>
  <input
    value={formData.phone}
    onChange={(e) => setFormData({...formData, phone: e.target.value})}
  />
</div>

// Columns
{ key: 'phone', label: 'Teléfono' }
```

## 🎯 Componentes Principales

### Header
```jsx
import { Header } from './components/common/Layout';
// Muestra: Usuario, Rol, Menú
```

### Sidebar
```jsx
import { Sidebar } from './components/common/Layout';
// Muestra: Navegación por rol
```

### Tabla
```jsx
import { Table } from './components/common/Table';
<Table 
  columns={[{ key: 'name', label: 'Nombre' }]}
  data={data}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Modal
```jsx
import { Modal } from './components/common/Table';
<Modal
  isOpen={isOpen}
  title="Editar"
  onClose={handleClose}
  onConfirm={handleSave}
>
  {/* Contenido */}
</Modal>
```

### Alert
```jsx
import { Alert } from './components/common/Table';
<Alert 
  type="success|error|warning|info"
  message="Mensaje"
  onClose={() => setAlert(null)}
/>
```

## 📊 Context Hooks

### Usar autenticación
```jsx
import { useAuth } from './context/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

### Usar datos
```jsx
import { useData } from './context/DataContext';

const { professors, addProfessor, updateProfessor } = useData();
```

## 🔒 Rutas Protegidas

```jsx
<Route path="/dashboard" element={
  <ProtectedRoute allowedRoles={['admin', 'director']}>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

## 📥 Exportar CSV

```jsx
import { exportToCSV } from './utils/helpers';

const handleExport = () => {
  exportToCSV(
    data,
    [{ key: 'name', label: 'Nombre' }],
    'profesores.csv'
  );
};
```

## 🛡️ Validaciones

```jsx
import { validateEmail, validatePassword } from './utils/helpers';

if (!validateEmail(email)) {
  // Error
}
```

## ⚙️ Estilos Útiles

### Card
```jsx
<div className="card">
  <h2>Título</h2>
  <p>Contenido</p>
</div>
```

### Grid
```jsx
<div className="grid">
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
</div>
```

### Buttons
```jsx
<button className="btn btn-primary">Primario</button>
<button className="btn btn-secondary">Secundario</button>
<button className="btn btn-danger">Peligro</button>
```

### Formulario
```jsx
<div className="form-group">
  <label>Etiqueta</label>
  <input type="text" />
</div>
```

## 🔍 Debug

### Ver qué usuario está logueado
```javascript
console.log(useAuth().user);
```

### Ver datos en context
```javascript
console.log(useData());
```

### Ver localStorage
```javascript
localStorage.getItem('user')
```

## 📱 Responsive Breakpoints

```css
Desktop: 1200px+
Tablet: 768px - 1199px
Mobile: 320px - 767px
```

## 🎓 Próximos Pasos

1. **Conectar Backend**: Reemplazar mocks en contexts con llamadas HTTP
2. **Autenticación JWT**: Cambiar de cookies a JWT tokens
3. **Tests**: Agregar tests unitarios y E2E
4. **Performance**: Implementar lazy loading y code splitting
5. **PWA**: Convertir a Progressive Web App

## 📚 Recursos Útiles

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Vite Guide](https://vitejs.dev)
- [MDN Web Docs](https://developer.mozilla.org)

## 🚨 Solución de Problemas

### No se cargan los estilos
- Verificar que los archivos CSS estén importados en App.jsx

### El router no funciona
- Verificar que AuthProvider envuelva App
- Revisar ProtectedRoute en rutas

### LocalStorage no persiste
- Verificar privacy/incognito del navegador
- Limpiar cache si es necesario

### Módulos no encontrados
- Ejecutar `npm install` nuevamente
- Verificar rutas de importación

---

**¡Sistema Listo para Usar! 🎉**
