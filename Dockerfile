FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@11.3.0

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
