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
COPY ./back/.env ./

# Install packages and deps.
RUN npm install

CMD ["npm", "run", "start"]