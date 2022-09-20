FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./

COPY . .
RUN npm ci
RUN npm run build

EXPOSE 8080
CMD [ "node", "./dist/index.js" ]