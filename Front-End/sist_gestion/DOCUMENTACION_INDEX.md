# 📚 Índice de Documentación
## Sistema de Gestión de Carga Docente - UCI

### 🚀 Inicio Rápido

1. **[GUIA_RAPIDA.md](./GUIA_RAPIDA.md)** - ⭐ COMIENZA AQUÍ
   - Comandos para iniciar
   - Credenciales de prueba
   - Atajos y trucos
   - Solución de problemas

2. **[INSTALAR.sh](./INSTALAR.sh)** - Script de instalación automática

---

### 📖 Documentación Principal

3. **[SISTEMA_COMPLETO.md](./SISTEMA_COMPLETO.md)** - Documentación Completa
   - Descripción del sistema
   - Características principales
   - Tecnologías utilizadas
   - Instalación paso a paso
   - Funcionalidades por módulo

4. **[ESTRUCTURA_PROYECTO.txt](./ESTRUCTURA_PROYECTO.txt)** - Estructura Detallada
   - Árbol de carpetas
   - Descripción de archivos
   - Rutas principales
   - Contextos disponibles
   - Componentes

---

### ✅ Validación

5. **[CHECKLIST.md](./CHECKLIST.md)** - Checklist de Verificación
   - Todas las características implementadas
   - Validación de funcionalidades
   - Score del proyecto

6. **[PRUEBAS.md](./PRUEBAS.md)** - Plan de Pruebas
   - Pruebas manuales
   - Casos de uso
   - Validación por rol
   - Debugging tips

---

### 🎉 Resumen

7. **[RESUMEN_FINAL.md](./RESUMEN_FINAL.md)** - Resumen del Proyecto
   - Lo que se ha creado
   - Estadísticas
   - Ventajas técnicas
   - Próximos pasos

---

### ⚙️ Configuración

8. **[src/config.js](./src/config.js)** - Configuración Global
   - Constantes
   - Roles y permisos
   - Colores
   - Validaciones

---

### 📁 Estructura de Carpetas

```
sist_gestion/
├── 📖 Documentación (AQUÍ ESTÁ)
│   ├── README.md                    ← Por Vite
│   ├── GUIA_RAPIDA.md              ← ⭐ COMIENZA AQUÍ
│   ├── SISTEMA_COMPLETO.md
│   ├── ESTRUCTURA_PROYECTO.txt
│   ├── CHECKLIST.md
│   ├── PRUEBAS.md
│   ├── RESUMEN_FINAL.md
│   └── DOCUMENTACION_INDEX.md      ← Este archivo
│
├── 🔧 Configuración
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── index.html
│
└── 💻 Código
    └── src/
        ├── components/
        ├── pages/
        ├── context/
        ├── utils/
        ├── styles/
        ├── App.jsx
        ├── main.jsx
        └── config.js
```

---

## 🎯 Flujo de Lectura Recomendado

### Para Usuarios Nuevos:
1. **GUIA_RAPIDA.md** - Cómo empezar
2. **Instalar dependencias** - npm install
3. **Iniciar servidor** - npm run dev
4. **Probar con credenciales de prueba**

### Para Desarrolladores:
1. **ESTRUCTURA_PROYECTO.txt** - Entender la estructura
2. **src/App.jsx** - Punto de entrada
3. **src/context/AuthContext.jsx** - Autenticación
4. **src/config.js** - Configuración
5. **Componentes en src/components/**

### Para QA/Testers:
1. **PRUEBAS.md** - Plan de pruebas
2. **CHECKLIST.md** - Features a validar
3. Ejecutar pruebas según plan

### Para Mantenimiento:
1. **ESTRUCTURA_PROYECTO.txt** - Dónde está cada cosa
2. **src/config.js** - Configuración central
3. **GUIA_RAPIDA.md** - Comandos útiles
4. **RESUMEN_FINAL.md** - Overview del proyecto

---

## 📚 Documentos por Tópico

### Instalación
- GUIA_RAPIDA.md → Sección "Inicio Rápido"
- SISTEMA_COMPLETO.md → Sección "Instalación"
- INSTALAR.sh → Script automático

### Uso del Sistema
- GUIA_RAPIDA.md → Credenciales de prueba
- PRUEBAS.md → Plan de pruebas por rol
- RESUMEN_FINAL.md → Características destacadas

### Desarrollo
- ESTRUCTURA_PROYECTO.txt → Estructura de carpetas
- GUIA_RAPIDA.md → Componentes principales
- src/config.js → Configuración global

### Solución de Problemas
- GUIA_RAPIDA.md → Sección "Solución de Problemas"
- ESTRUCTURA_PROYECTO.txt → Files importantes
- PRUEBAS.md → Debugging tips

---

## 🔑 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@uci.edu.cu | 123456 |
| Director | director@uci.edu.cu | 123456 |
| Jefe Disciplina | jefe@uci.edu.cu | 123456 |
| Vicedecano | vicedecano@uci.edu.cu | 123456 |

---

## ⚡ Comandos Esenciales

```bash
# Instalación
npm install

# Desarrollo
npm run dev                    # http://localhost:5173

# Producción
npm run build                  # Compilar
npm run preview                # Ver build local

# Linting
npm run lint                   # Verificar código
```

---

## 🎨 Colores del Sistema

- **Primario**: #0052cc (Azul UCI)
- **Primario Oscuro**: #003d99
- **Éxito**: #28a745
- **Peligro**: #dc3545
- **Warning**: #ffc107
- **Fondo**: #f5f7fa
- **Texto**: #333
- **Blanco**: #ffffff

---

## 🧩 Componentes Principales

### Autenticación
- `LoginPage.jsx` - Página de login
- `RegisterPage.jsx` - Página de registro
- `AuthContext.jsx` - Manejo de sesión

### UI
- `Layout.jsx` - Header, Sidebar, MainLayout
- `Table.jsx` - Tabla, Modal, Alert
- `WelcomeCard.jsx` - Card de bienvenida

### Dashboards (uno por rol)
- `AdminDashboard.jsx`
- `DirectorDashboard.jsx`
- `JefeDisciplinaDashboard.jsx`
- `VicedeanoDashboard.jsx`

---

## 📞 Contacto & Soporte

Para soporte técnico:
- Email: soporte@uci.edu.cu
- Documentación: Ver archivos .md
- FAQ: Revisar GUIA_RAPIDA.md → Solución de Problemas

---

## ✅ Validación Final

Todos los documentos han sido revisados ✓
Sistema completamente funcional ✓
Listo para producción ✓

---

**Última actualización**: Enero 2026
**Versión**: 1.0 (MVP)
**Estado**: ✅ COMPLETADO

---

**¡Bienvenido al Sistema de Gestión de Carga Docente! 🎉**
