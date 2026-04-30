FROM node:24-alpine

RUN apk add --no-cache docker-cli git curl

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["node", "api.js"]
