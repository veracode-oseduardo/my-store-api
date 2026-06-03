# Stage 1: build dependencies
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false
COPY . .
RUN npm run build || echo "no build step"

# Stage 2: runtime
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
# Instala solo dependencias de producción
COPY package.json package-lock.json ./
RUN npm ci --production
# Copia archivos desde builder
COPY --from=builder /app ./
# Exponer puerto
EXPOSE 3001

# Healthcheck opcional
# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
#  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Comando por defecto
CMD ["node", "server.js"]
