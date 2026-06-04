# BackendV1 - Docker Setup

Guía completa para ejecutar el proyecto en Docker.

## 📋 Requisitos

- [Docker](https://www.docker.com/products/docker-desktop) (v24+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.20+)
- Git (opcional)

## 🚀 Inicio Rápido

### 1. Clonar o descargar el repositorio
```bash
git clone <tu-repo>
cd Backendv1
```

### 2. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
nano .env
```

### 3. Construir e iniciar contenedores
```bash
# Opción 1: Usar docker-compose (recomendado)
docker-compose up -d

# Opción 2: Construir y ejecutar manualmente
docker build -t backendv1:latest .
docker run -p 3000:3000 backendv1:latest
```

## 🐳 Comandos Docker Compose

### Operaciones básicas
```bash
# Iniciar servicios en segundo plano
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs solo de la app
docker-compose logs -f app

# Ver logs solo de DB
docker-compose logs -f db

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (cuidado: borra BD)
docker-compose down -v

# Reiniciar servicios
docker-compose restart

# Reiniciar solo la app
docker-compose restart app
```

### Gestión de base de datos
```bash
# Ejecutar migraciones
docker-compose exec app npx prisma migrate deploy

# Ver estado de migraciones
docker-compose exec app npx prisma migrate status

# Generar cliente Prisma
docker-compose exec app npx prisma generate

# Abrir Prisma Studio para inspeccionar BD
docker-compose exec app npx prisma studio
```

### Acceso a la base de datos
```bash
# Conectar directamente con psql
docker-compose exec db psql -U postgres -d backendv1_db

# Ver tablas (dentro de psql)
\dt

# Salir de psql
\q
```

## 🛠️ Scripts npm

```bash
# Desarrollo local (sin Docker)
npm run dev

# Producción local
npm start

# Construcción Docker
npm run docker:build

# Iniciar con Docker
npm run docker:up

# Detener Docker
npm run docker:down

# Ver logs
npm run docker:logs

# Reiniciar
npm run docker:restart
```

## 📝 Configuración (.env)

Variables principales a configurar:

```env
# Base de datos PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@db:5432/backendv1_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=backendv1_db
DB_PORT=5432

# Node.js
NODE_ENV=development
APP_PORT=3000

# Seguridad JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@backendv1.com
```

## 🔍 Endpoints disponibles

- `GET /health` - Health check del servidor
- `GET /api` - Información de la API
- `GET /api/auth/*` - Autenticación
- `GET /api/usuarios/*` - Gestión de usuarios
- `GET /api/tarjeta/*` - Tarjeta
- `GET /api/asistencias/*` - Asistencias
- `GET /api/geo/*` - Geolocalización
- `GET /api/notificaciones/*` - Notificaciones
- `GET /api/reportes/*` - Reportes
- `GET /api/panel/*` - Panel
- `GET /uploads/*` - Archivos subidos

## 🏗️ Arquitectura Docker

```
┌─────────────────────────────────────┐
│      Docker Compose Network         │
│  ┌─────────────────────────────┐   │
│  │    Node.js Express App       │   │
│  │  (puerto 3000)               │   │
│  │    - Container: backendv1_app│   │
│  │    - Imagen: backendv1:latest│   │
│  │    - Volumen: ./uploads      │   │
│  └────────────┬──────────────────┘   │
│               │                       │
│  ┌────────────▼──────────────────┐   │
│  │  PostgreSQL 17 Database       │   │
│  │  (puerto 5432)                │   │
│  │    - Container: backendv1_db  │   │
│  │    - Imagen: postgres:17      │   │
│  │    - Volumen: postgres_data   │   │
│  └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 🚨 Troubleshooting

### El contenedor se detiene inmediatamente
```bash
# Ver logs de error
docker-compose logs app

# Verificar que el archivo .env existe
ls -la .env
```

### Error de conexión a base de datos
```bash
# Reiniciar DB
docker-compose restart db

# Esperar a que DB esté lista
docker-compose exec app npx prisma migrate deploy
```

### Puerto ya en uso
```bash
# Cambiar puerto en .env
APP_PORT=3001

# O liberar el puerto
lsof -i :3000
kill -9 <PID>
```

### Ver todos los contenedores
```bash
docker ps -a
```

### Eliminar todo y empezar de nuevo
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## 📊 Monitoreo

### Ver uso de recursos
```bash
docker stats
```

### Ver procesos en el contenedor
```bash
docker-compose exec app ps aux
```

## 🔐 Producción

Para producción, considera:

1. **Cambiar JWT_SECRET** a un valor seguro generado
2. **Usar secretos de Docker** en lugar de .env
3. **Habilitar HTTPS** con un reverse proxy (nginx)
4. **Configurar backups automáticos** de PostgreSQL
5. **Usar registros privados** para imágenes (DockerHub, ECR, etc.)
6. **Limitar recursos** en docker-compose.yml
7. **Usar healthchecks** (ya configurados)

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Documentation](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

## 💡 Tips

- Usa `docker-compose logs -f` para depuración en tiempo real
- Guarda las variables sensibles en un `.env.local` (no versionado)
- Mantén la imagen Docker pequeña usando multi-stage builds
- Usa volúmenes para datos persistentes
- Configura healthchecks en producción

---

**Última actualización:** 2 de abril de 2026
