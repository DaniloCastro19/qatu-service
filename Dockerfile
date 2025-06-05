# Build & Test
FROM node:20 as builder

WORKDIR /app

# Copiar solo lo necesario para la instalación de dependencias
COPY package*.json ./

# Instalación de todas las dependencias (Incluidas las devDependencies)
RUN npm ci

# Copia de todo el código fuente (Incluyendo los tests)
COPY . .

RUN npm run test

# Production image
FROM node:20 AS production

WORKDIR /app

# Copia de solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copia del código ya buideado
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["node", "src/server.js"]