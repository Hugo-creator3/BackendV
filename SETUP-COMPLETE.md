# 🐳 Docker Setup Complete - BackendV1

## ✅ Archivos Creados/Actualizados

### Archivos Docker
- ✅ **Dockerfile** - Multi-stage build optimizado
  - Usa Node 20-alpine (ligero)
  - Manejo de señales con dumb-init
  - Health checks configurados
  
- ✅ **docker-compose.yml** - Orquestación producción
  - PostgreSQL 17
  - Express app con Node 20
  - Volúmenes persistentes
  - Health checks
  
- ✅ **docker-compose.dev.yml** - Orquestación desarrollo
  - Hot reload configurado
  - Volúmenes de desarrollo
  - Environment de desarrollo

- ✅ **.dockerignore** - Optimización de capas
  - Excluye node_modules, .git, etc.
  - Reduce tamaño de imagen

### Configuración
- ✅ **.env.example** - Template de variables (sin secretos)
- ✅ **.env.local** - Variables de desarrollo local
- ✅ **.gitignore** - Protección de archivos sensibles

### Scripts y Setup
- ✅ **dev-setup.sh** - Script de inicialización (Linux/Mac)
- ✅ **dev-setup.ps1** - Script de inicialización (Windows)

### Aplicación
- ✅ **src/server.js** - Actualizado
  - Endpoints de health check
  - Manejo de errores global
  - Logs mejorados
  - Soporte para variables de entorno

- ✅ **package.json** - Scripts añadidos
  - npm start
  - npm run dev
  - npm run docker:*
  - npm run prisma:*

### Documentación
- ✅ **DOCKER.md** - Guía completa (⭐ LEER ESTO)
- ✅ **QUICK-COMMANDS.md** - Comandos rápidos

## 🚀 Próximos Pasos

### 1️⃣ Configuración Inicial
```powershell
# Windows
.\dev-setup.ps1

# Linux/Mac
bash ./dev-setup.sh
```

### 2️⃣ Configurar Variables de Entorno
```bash
# Editar .env con tus valores
cp .env.example .env
# Abre .env en tu editor y completa los datos
```

### 3️⃣ Iniciar Servicios
```bash
# Iniciar Docker
docker-compose up -d

# Ver logs
docker-compose logs -f app
```

### 4️⃣ Verificar que Todo Funciona
```bash
# Health check
curl http://localhost:3000/health

# API info
curl http://localhost:3000/api
```

## 📊 Estructura Docker

```
BackendV1
├── Dockerfile              # Imagen de producción
├── docker-compose.yml      # Servicios producción
├── docker-compose.dev.yml  # Servicios desarrollo
├── .dockerignore          # Exclusiones
├── .env.example           # Template
├── .env.local             # Local dev
├── .gitignore             # Git ignore
├── DOCKER.md              # Documentación
├── QUICK-COMMANDS.md      # Comandos útiles
├── dev-setup.sh           # Setup Linux/Mac
├── dev-setup.ps1          # Setup Windows
└── src/
    ├── server.js          # Actualizado ✅
    └── ...
```

## 🔑 Variables de Entorno Importantes

```env
# Database
DATABASE_URL=postgresql://postgres:password@db:5432/backendv1_db

# Node
NODE_ENV=development
APP_PORT=3000

# JWT (CAMBIAR ESTO)
JWT_SECRET=your-secret-key

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=app-password
```

## 🎯 Comandos Principales

```bash
# Iniciar
docker-compose up -d

# Logs
docker-compose logs -f app

# Detener
docker-compose down

# Rebuild
docker-compose up -d --build

# Ejecutar migraciones
docker-compose exec app npx prisma migrate deploy

# Abrir Prisma Studio
docker-compose exec app npx prisma studio

# Shell en contenedor
docker-compose exec app sh
```

## 🛠️ Desarrollo Local Sin Docker

```bash
# Si prefieres sin Docker
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## 🔒 Seguridad - IMPORTANTE

- ✅ No commitear `.env` (ya en .gitignore)
- ✅ Cambiar `JWT_SECRET` antes de producción
- ✅ Cambiar credenciales de DB
- ✅ Configurar SMTP con valores reales
- ✅ Usar `HTTPS` en producción
- ✅ Base de datos con backups automáticos

## 📁 Archivos a NO Modificar

Estos se actualizarán automáticamente:
- `package.json` - Scripts añadidos ✅
- `src/server.js` - Mejorado ✅

## ⚠️ Cosas que Debes Hacer

1. [ ] Editar `.env` con valores reales
2. [ ] Cambiar `JWT_SECRET`
3. [ ] Configurar SMTP (opcional en dev)
4. [ ] Ejecutar `docker-compose up -d`
5. [ ] Probar endpoints

## 📚 Recursos

- [DOCKER.md](./DOCKER.md) - Guía completa ⭐
- [QUICK-COMMANDS.md](./QUICK-COMMANDS.md) - Comandos útiles
- Docker: https://docs.docker.com
- Prisma: https://www.prisma.io/docs

## 💻 Verificación Final

```bash
# Ver que todo funciona
docker-compose ps

# Debe mostrar dos contenedores "healthy/running":
# - backendv1_db (postgres)
# - backendv1_app (node)

# Probar API
curl http://localhost:3000/health
# Debe responder: {"status":"ok",...}
```

---

**¡Proyecto dockerizado correctamente! 🎉**

Para más información, ver **DOCKER.md** y **QUICK-COMMANDS.md**
