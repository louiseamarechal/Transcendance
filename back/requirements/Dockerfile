# Load debian image
FROM node:20-bullseye-slim

# Update package manager.
RUN apt-get update
RUN apt-get upgrade -y

# Workdir to app.
WORKDIR /app

# Copy all necessary content to container.
COPY ./back/ ./
COPY ./back/prisma/ /app/prisma/
COPY .env ./

# Install packages and deps.
RUN npm install
RUN npx prisma generate

CMD ["npm", "run", "start"]