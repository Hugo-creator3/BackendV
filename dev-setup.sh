# Script de inicialización para desarrollo local
# Ejecutar con: bash ./dev-setup.sh

#!/bin/bash

echo "🚀 Configurando ambiente de desarrollo..."

# Crear .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Edítalo con tus valores."
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Generar cliente Prisma
echo "🔧 Generando cliente Prisma..."
npx prisma generate

# Ejecutar migraciones
echo "🗄️  Ejecutando migraciones..."
npx prisma migrate deploy

# Crear directorio de uploads
echo "📁 Creando directorio uploads..."
mkdir -p uploads
chmod 755 uploads

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "Próximos pasos:"
echo "1. Edita .env con tus valores"
echo "2. Para desarrollo local: npm run dev"
echo "3. Para Docker: npm run docker:up"
echo ""
echo "📖 Ver DOCKER.md para más información"
