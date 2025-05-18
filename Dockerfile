FROM node:20 as base

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@latest

FROM base AS deps
RUN npm ci

FROM base as production
RUN npm ci --omit=dev
COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
