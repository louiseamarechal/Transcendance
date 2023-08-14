FROM node:lts AS development

# Create app directory
WORKDIR /code/back

COPY ./back/package.json /code/back/package.json
COPY ./back/package-lock.json /code/back/package-lock.json
COPY ./back/prisma /code/back/prisma/

RUN npm ci
RUN npx prisma generate

COPY ./back /code/back
COPY ./shared /code/shared

RUN npm run build

CMD ["npm", "run", "start"]