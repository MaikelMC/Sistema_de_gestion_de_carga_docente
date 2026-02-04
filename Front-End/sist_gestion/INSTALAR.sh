#!/bin/bash

# Sistema de Gestión de Carga Docente - Script de Instalación
# Ejecutar en Windows PowerShell o Terminal de Linux/Mac

echo "================================"
echo "Sistema de Gestión de Carga Docente"
echo "UCI - Universidad de Ciencias Informáticas"
echo "================================"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Por favor, descarga Node.js desde: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"
echo "✅ npm detectado: $(npm --version)"
echo ""

# Cambiar a directorio del proyecto
echo "📁 Accediendo al directorio del proyecto..."
cd "$(dirname "$0")"

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas exitosamente"
echo ""

# Mostrar instrucciones de inicio
echo "================================"
echo "🎉 ¡Instalación Completada!"
echo "================================"
echo ""
echo "📝 Para iniciar el servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "🏗️ Para crear build de producción:"
echo "   npm run build"
echo ""
echo "🔍 Para ver preview del build:"
echo "   npm run preview"
echo ""
echo "🎨 Accede a: http://localhost:5173"
echo ""
echo "🔑 Credenciales de prueba:"
echo "   Admin: admin@uci.edu.cu / 123456"
echo "   Director: director@uci.edu.cu / 123456"
echo "   Jefe: jefe@uci.edu.cu / 123456"
echo "   Vicedecano: vicedecano@uci.edu.cu / 123456"
echo ""
echo "================================"
