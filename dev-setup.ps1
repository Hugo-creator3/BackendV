# Script de inicialización para desarrollo local (Windows)
# Ejecutar con: PowerShell -ExecutionPolicy Bypass -File .\dev-setup.ps1

Write-Host "🚀 Configurando ambiente de desarrollo..." -ForegroundColor Cyan

# Crear .env si no existe
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creando archivo .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado. Edítalo con tus valores." -ForegroundColor Green
}

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

# Generar cliente Prisma
Write-Host "🔧 Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

# Ejecutar migraciones
Write-Host "🗄️  Ejecutando migraciones..." -ForegroundColor Yellow
npx prisma migrate deploy

# Crear directorio de uploads
Write-Host "📁 Creando directorio uploads..." -ForegroundColor Yellow
if (-not (Test-Path "uploads")) {
    New-Item -ItemType Directory -Path "uploads" | Out-Null
}

Write-Host ""
Write-Host "✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Edita .env con tus valores"
Write-Host "2. Para desarrollo local: npm run dev"
Write-Host "3. Para Docker: npm run docker:up"
Write-Host ""
Write-Host "📖 Ver DOCKER.md para más información" -ForegroundColor Blue
