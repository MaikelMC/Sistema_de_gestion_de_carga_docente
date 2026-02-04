🧪 PLAN DE PRUEBAS RÁPIDAS
═══════════════════════════════════════════════════════════════

Este documento contiene pruebas rápidas para validar que todo funciona correctamente.

Ejecutar en este orden: 1→2→3→4→5


PRUEBA 1: INSTALACIÓN Y ARRANQUE
═══════════════════════════════════════════════════════════════

□ Instalar dependencias:
  npm install

□ Iniciar servidor:
  npm run dev

□ Abrir navegador en:
  http://localhost:5173

□ Resultado esperado:
  ✓ Página de login cargada
  ✓ Sin errores en console
  ✓ Estilos azul y blanco visibles
  ✓ Logo SGCD visible


PRUEBA 2: AUTENTICACIÓN - ADMIN
═══════════════════════════════════════════════════════════════

□ Email: admin@uci.edu.cu
□ Contraseña: 123456

Verificar:
□ Login exitoso
□ Redirección a dashboard
□ Nombre "Administrador" visible
□ Rol "Administrador" mostrado
□ Sidebar visible
□ Header mostrado

Explorar Admin Dashboard:
□ Click en "+ Agregar Usuario"
□ Modal abre correctamente
□ Rellenar formulario
□ Click Crear
□ Usuario aparece en tabla
□ Edit funciona
□ Delete funciona


PRUEBA 3: AUTENTICACIÓN - DIRECTOR
═══════════════════════════════════════════════════════════════

□ Logout actual (click menú ⋮)
□ Email: director@uci.edu.cu
□ Contraseña: 123456

Verificar:
□ Login exitoso
□ "Director de Formación" mostrado
□ Dashboard diferente a admin
□ Tabla de profesores visible
□ Stats cards visibles
□ Botón "Descargar" presente

Probar Exportar:
□ Click "Descargar Filtrados"
□ Archivo CSV descargado
□ Archivo tiene datos


PRUEBA 4: AUTENTICACIÓN - JEFE DISCIPLINA
═══════════════════════════════════════════════════════════════

□ Logout actual
□ Email: jefe@uci.edu.cu
□ Contraseña: 123456

Verificar:
□ Login exitoso
□ "Jefe de Disciplina" mostrado
□ "+ Agregar Profesor" botón
□ Tabla de profesores
□ Stat cards diferentes

Agregar Profesor:
□ Click "+ Agregar Profesor"
□ Modal abre
□ Completar: Nombre
□ Completar: Email
□ Completar: Disciplina
□ Completar: Asignaturas
□ Completar: Facultad
□ Completar: Mensaje (IMPORTANTE - Obligatorio)
□ Click Agregar
□ Profesor aparece en tabla
□ Alert "Profesor agregado"

Editar Profesor:
□ Click botón edit (✎) en tabla
□ Modal abre con datos
□ Modificar mensaje
□ Click Actualizar
□ Cambios reflejados
□ Alert "Profesor actualizado"

Eliminar Profesor:
□ Click botón delete (✕)
□ Confirmar eliminación
□ Profesor desaparece
□ Alert "Profesor eliminado"


PRUEBA 5: AUTENTICACIÓN - VICEDECANO
═══════════════════════════════════════════════════════════════

□ Logout actual
□ Email: vicedecano@uci.edu.cu
□ Contraseña: 123456

Verificar:
□ Login exitoso
□ "Vicedecano de Formación" mostrado
□ Acceso completo
□ Botones de descarga presentes
□ Filtros de disciplina
□ Filtros de facultad

Probar Filtros:
□ Seleccionar disciplina
□ Tabla se actualiza
□ Seleccionar facultad
□ Tabla se actualiza
□ Click "Descargar Filtrados"
□ CSV descargado

Probar Mensajes:
□ Scroll a sección de "Registro de Cambios"
□ Ver comentarios
□ Fechas mostradas
□ Autores visibles


PRUEBA 6: VALIDACIONES DE FORMULARIOS
═══════════════════════════════════════════════════════════════

□ Intenta enviar formulario vacío
  Resultado: Error visible

□ Email inválido
  Resultado: Error mostrado

□ Contraseña < 6 caracteres
  Resultado: Error validación

□ Mensaje vacío (Jefe Disciplina)
  Resultado: Campo requerido


PRUEBA 7: INTERFAZ & RESPONSIVE
═══════════════════════════════════════════════════════════════

Desktop (1200px+):
□ Layout completo visible
□ Sidebar expandido
□ Tabla bien formateada
□ Sin scroll horizontal

Tablet (768px - 1199px):
□ Layout responsivo
□ Sidebar colapsable
□ Tabla scrolleeable
□ Botones accesibles

Mobile (320px - 767px):
□ Sidebar colapsado
□ Menú hamburguesa funciona
□ Tabla scrolleeable
□ Botones touch-friendly
□ Texto legible


PRUEBA 8: COMPONENTES
═══════════════════════════════════════════════════════════════

Tabla:
□ Datos muestran correctamente
□ Acciones visibles
□ Hover effect funciona
□ Edit/Delete botones funcionan

Modal:
□ Abre smooth
□ Cierra al clickear X
□ Cierra al clickear Cancelar
□ Formulario envía datos
□ Overlay oscuro visible

Alert:
□ Éxito: Verde ✓
□ Error: Rojo ✗
□ Info: Azul ℹ
□ Warning: Amarillo ⚠
□ Se cierra automático


PRUEBA 9: NAVEGACIÓN
═══════════════════════════════════════════════════════════════

□ Click en items de sidebar
□ Se ven activos
□ Color azul en activo
□ Logo clickeable
□ Menú usuario funciona
□ Logout funciona
□ Redirecciona a login


PRUEBA 10: DATOS & PERSISTENCIA
═══════════════════════════════════════════════════════════════

□ Agregar profesor
□ Recargar página (F5)
□ Profesor sigue ahí
□ Usuario logueado sigue
□ Cerrar navegador
□ Abrir de nuevo
□ Sesión persiste


═══════════════════════════════════════════════════════════════

RESUMEN DE PRUEBAS
═══════════════════════════════════════════════════════════════

Checkboxes completados: ____ / 70+

Si todos están ✓: ¡SISTEMA FUNCIONANDO PERFECTAMENTE! 🎉

Si hay ✗: Revisar console (F12) para errores


CASOS DE PRUEBA ADICIONALES
═══════════════════════════════════════════════════════════════

Edge Cases:
□ Email con caracteres especiales
□ Nombres muy largos
□ Muchos profesores (100+)
□ Asignaturas con comas
□ Mensajes muy largos

Performance:
□ Agregar 50 profesores
□ Tabla sigue rápida
□ No hay lag
□ Sin memory leaks

Accesibilidad:
□ Tab por formulario
□ Enter en botones
□ Focus visible
□ Color contrast ok


DEBUGGING
═══════════════════════════════════════════════════════════════

Abrir DevTools (F12):

Console:
□ Sin errores rojos
□ Sin warnings críticos

Network:
□ Requests están ok
□ No hay 404s
□ Respuestas rápidas

Performance:
□ Loading < 2s
□ Interactions smooth
□ FPS constante

LocalStorage:
□ localStorage.getItem('app_user')
  Debe retornar usuario logueado
□ localStorage.getItem('app_token')
  Debe retornar token


═══════════════════════════════════════════════════════════════

BUGS CONOCIDOS / PENDIENTE
═══════════════════════════════════════════════════════════════

Ninguno reportado en MVP 1.0 ✓


═══════════════════════════════════════════════════════════════

¡PRUEBAS COMPLETADAS!

Si todo pasó: Sistema está 100% funcional ✅
Si hay issues: Revisar GUIA_RAPIDA.md o ESTRUCTURA_PROYECTO.txt

═══════════════════════════════════════════════════════════════
