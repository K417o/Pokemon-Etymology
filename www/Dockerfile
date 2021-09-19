# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY ./package*.json ./

RUN npm install
RUN npm install -g serve

COPY . ./
RUN npm run build

CMD [ "serve", "-s", "-p", "3000", "build" ]