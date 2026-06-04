# Stage 1: Dependencies
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Stage 3: Production
FROM node:20-alpine
WORKDIR /app

# Instalar dumb-init para manejar señales
RUN apk add --no-cache dumb-init

# Copiar node_modules de production
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar código y otros archivos
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src ./src
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY package*.json ./
COPY .env* ./

# Crear directorio de uploads
RUN mkdir -p uploads && chmod 755 uploads

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Usar dumb-init como PID 1
ENTRYPOINT ["dumb-init", "--"]

# Comando por defecto
CMD ["node", "src/server.js"]
