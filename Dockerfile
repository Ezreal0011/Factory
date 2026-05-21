FROM node:24-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .

RUN mkdir -p /app/data
EXPOSE 5174

CMD ["node", "server.mjs"]
