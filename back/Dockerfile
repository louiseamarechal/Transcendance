# FROM node:lts AS development

# WORKDIR /code/back
# COPY ./back/package.json /code/back/package.json
# COPY ./back/package-lock.json /code/back/package-lock.json
# RUN npm ci
# COPY ./back /code/back
# COPY ./shared /code/shared

# CMD [ "npm", "start" ]

FROM node:lts AS development

# Create app directory
WORKDIR /code/back

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./back/package.json /code/back/package.json
COPY ./back/package-lock.json /code/back/package-lock.json
COPY ./back/prisma /code/back/prisma/
# Install app dependencies
RUN npm ci
# Generate prisma client, leave out if generating in `postinstall` script
RUN npx prisma generate

COPY ./back /code/back
COPY ./shared /code/shared

RUN npm run build

CMD ["npm", "run", "start"]
# FROM node:lts as production

# COPY --from=builder /code/back/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/dist ./dist

