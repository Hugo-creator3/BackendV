# Quick Commands for Development

## 🚀 Quick Start (Windows)

```powershell
# Ejecutar setup inicial
.\dev-setup.ps1

# Iniciar servicios Docker
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 📝 Comandos Útiles

### Linux/Mac
```bash
# Setup inicial
bash ./dev-setup.sh

# Iniciar desarrollo con Docker
docker-compose -f docker-compose.dev.yml up -d

# Ver logs con filtro
docker-compose logs -f app | grep -i error

# Ejecutar comando en contenedor
docker-compose exec app npm run prisma:migrate

# Acceso a shell del contenedor
docker-compose exec app sh

# Inspeccionar BD
docker-compose exec app npx prisma studio
```

### Windows PowerShell
```powershell
# Setup inicial
.\dev-setup.ps1

# Iniciar desarrollo con Docker
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose logs -f app

# Ejecutar comando en contenedor
docker-compose exec app npm run prisma:migrate

# Acceso a shell del contenedor
docker-compose exec app sh

# Inspeccionar BD
docker-compose exec app npx prisma studio
```

## 🐛 Debugging

### Ver todas las imágenes Docker
```bash
docker images | grep backendv1
```

### Ver todos los contenedores
```bash
docker ps -a
```

### Ver logs filtrados
```bash
docker-compose logs --tail=100 app
docker-compose logs app | grep "error"
```

### Eliminar caché de build
```bash
docker-compose build --no-cache
```

### Ejecutar migraciones
```bash
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma migrate status
```

### Seed de datos (si está configurado)
```bash
docker-compose exec app npx prisma db seed
```

## 🔍 Problemas Comunes

### Contenedor falla inmediatamente
```bash
docker-compose logs app
# Busca el error en los logs
```

### Puerto ya en uso
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows PowerShell
Get-NetTCPConnection -LocalPort 3000
Stop-Process -Id <PID> -Force
```

### Base de datos no conecta
```bash
# Reiniciar DB
docker-compose restart db
# Esperar 10 segundos y verificar
docker-compose logs db
```

### Limpiar todo y empezar de nuevo
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## 📊 Control de Recursos

### Ver uso de CPU/Memoria
```bash
docker stats
```

### Limitar recursos (en docker-compose.yml)
```yaml
services:
  app:
    ...
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## 🔐 Seguridad

### No commitear archivos sensibles
```bash
# Asegúrate de que estos NO están versionados:
.env          # Cambiar a .env.local
.env.production
.env.*.local
uploads/      # Directorio de archivos subidos
```

### Generar JWT_SECRET seguro
```bash
# Linux/Mac
openssl rand -base64 32

# PowerShell
[Convert]::ToBase64String((1..32|ForEach-Object {Get-Random -Max 256}))
```

## 📖 Archivos Importantes

- `Dockerfile` - Definición de la imagen Docker
- `docker-compose.yml` - Orquestación de servicios (producción)
- `docker-compose.dev.yml` - Orquestación para desarrollo
- `.env.example` - Variables de entorno (template)
- `.env` - Variables de entorno (local, NO versionar)
- `.dockerignore` - Archivos a ignorar en imagen
- `DOCKER.md` - Documentación completa

## ✅ Checklist Antes de Producción

- [ ] JWT_SECRET cambiado a valor seguro
- [ ] CORS_ORIGIN configurado correctamente
- [ ] SMTP configurado
- [ ] NODE_ENV=production
- [ ] Base de datos con backup automático
- [ ] HTTPS habilitado
- [ ] Limpieza de logs antigua configurada
- [ ] Healthchecks en funcionamiento
- [ ] Limites de recursos configurados
- [ ] Siniestro de datos persistente configurado
