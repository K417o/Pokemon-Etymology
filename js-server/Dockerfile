FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "web-server.js" ]
