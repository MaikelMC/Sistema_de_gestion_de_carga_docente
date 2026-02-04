# 🎓 Sistema de Gestión de Carga Docente - UCI

Sistema profesional de gestión de carga docente para la Universidad de Ciencias Informáticas (UCI), desarrollado con React 19, Vite y CSS puro.

## 📋 Quick Links

- 🚀 **[GUIA_RAPIDA.md](./GUIA_RAPIDA.md)** - Comienza aquí
- 📖 **[DOCUMENTACION_INDEX.md](./DOCUMENTACION_INDEX.md)** - Índice completo
- 📊 **[PROYECTO_COMPLETADO.txt](./PROYECTO_COMPLETADO.txt)** - Resumen del proyecto
- ✅ **[CHECKLIST.md](./CHECKLIST.md)** - Validación de features

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor (http://localhost:5173)
npm run dev

# 3. Build para producción
npm run build
```

## 🔑 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@uci.edu.cu | 123456 |
| Director | director@uci.edu.cu | 123456 |
| Jefe de Disciplina | jefe@uci.edu.cu | 123456 |
| Vicedecano | vicedecano@uci.edu.cu | 123456 |

## ✨ Características Principales

✅ **5 Dashboards diferentes** (Uno por rol)  
✅ **Gestión completa de profesores** (CRUD)  
✅ **Sistema de reportes** (Exportar CSV)  
✅ **Comentarios obligatorios** en cada cambio  
✅ **Diseño responsivo** (Desktop/Tablet/Mobile)  
✅ **CSS puro profesional** (Azul y Blanco)  
✅ **Autenticación y seguridad** (RBAC)  
✅ **Componentes reutilizables**  

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

## 🎨 Diseño

- **Tema**: Azul (#0052cc) y Blanco
- **Framework CSS**: Ninguno (CSS puro)
- **Responsive**: 100% compatible
- **Accesible**: WCAG compliant

## 📁 Estructura

```
src/
├── components/       # Componentes reutilizables
├── pages/           # Dashboards por rol
├── context/         # State global (Auth, Data)
├── utils/           # Utilidades y helpers
├── styles/          # CSS global
└── config.js        # Configuración central
```

## 📚 Documentación Completa

- **[SISTEMA_COMPLETO.md](./SISTEMA_COMPLETO.md)** - Descripción completa
- **[GUIA_RAPIDA.md](./GUIA_RAPIDA.md)** - Referencia rápida
- **[ESTRUCTURA_PROYECTO.txt](./ESTRUCTURA_PROYECTO.txt)** - Estructura detallada
- **[PRUEBAS.md](./PRUEBAS.md)** - Plan de pruebas

## 🎯 Funcionalidades por Rol

### Administrador
- Gestionar usuarios
- Asignar roles y permisos
- Bloquear/desbloquear usuarios
- Cambio de contraseñas

### Director de Formación
- Ver profesores de todas las disciplinas
- Descargar reportes CSV
- Visualizar mensajes de cambios
- Estadísticas generales

### Jefe de Disciplina/Departamento
- CRUD de profesores
- Asignación a disciplinas
- Comentarios obligatorios
- Registro de cambios

### Vicedecano de Formación
- Acceso completo a todas las disciplinas
- Gestión integral de profesores
- Descargas avanzadas
- Control total del sistema

## 🛠️ Comandos Útiles

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run preview      # Preview build local
npm run lint         # Linter
```

## 🔐 Seguridad

✓ Autenticación de usuarios  
✓ Control de acceso por rol (RBAC)  
✓ Rutas protegidas  
✓ Validación de inputs  
✓ Manejo de errores  

## 📱 Responsive Design

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 🎉 100% Completado

- ✅ Todas las funcionalidades
- ✅ Todos los roles
- ✅ Documentación completa
- ✅ Código profesional
- ✅ Listo para producción

---

**Desarrollado por**: Profesional Sénior Frontend  
**Versión**: 1.0 (MVP)  
**Año**: 2026  
**Universidad**: Universidad de Ciencias Informáticas (UCI)  

Para más detalles, ver [DOCUMENTACION_INDEX.md](./DOCUMENTACION_INDEX.md)

