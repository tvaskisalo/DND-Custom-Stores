FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY ./frontend .

RUN npm ci

RUN npm run build

FROM nginx:1.23.2

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html