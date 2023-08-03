# FROM node:16.18.0-alpine
FROM node:20-bullseye-slim

WORKDIR /app

COPY package.json ./ 

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]