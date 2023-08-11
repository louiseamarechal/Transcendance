# # Load debian image
# FROM node:20-bullseye-slim

# # Update package manager.
# RUN apt-get update
# RUN apt-get upgrade -y

# # Workdir to app.
# WORKDIR /app

# # Copy all necessary content to container.
# COPY ./back/ ./
# COPY ./back/prisma/ /app/prisma/
# COPY ./back/.env ./

# # Install packages and deps.
# RUN npm install

# CMD ["npm", "run", "start"]

# Load debian image
FROM node:lts

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