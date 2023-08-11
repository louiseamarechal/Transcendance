FROM node:lts AS development

WORKDIR /code/front
COPY ./front/package.json /code/front/package.json
COPY ./front/package-lock.json /code/front/package-lock.json
RUN npm ci
COPY ./front /code/front
COPY ./shared /code/shared

CMD [ "npm", "start" ]


# FROM development AS builder

# RUN npm run build



# FROM nginx:1.13-alpine

# COPY --from=builder /code/build /usr/share/nginx/html