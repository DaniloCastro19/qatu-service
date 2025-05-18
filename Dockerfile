FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@latest

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
