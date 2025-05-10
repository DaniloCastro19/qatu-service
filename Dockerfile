# Build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# Production stage
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/test ./test
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "src/server.js"]
