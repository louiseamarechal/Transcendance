# FROM node:16.18.0-alpine
FROM node:20-bullseye-slim

# Workdir to app.
WORKDIR /app

# Copy packages file
COPY package.json ./

# Copy all necessary content to container.
COPY . .

# Install packages and deps.
RUN npm install

EXPOSE 3000

# RUN ["npm", "run", "prisma:dev:deploy"]

# CMD ["npm", "run", "start"]
CMD ["sh", "-c", "npm", "run", "init"]
ENTRYPOINT ["sh", "-c", "npm run start:prod"]