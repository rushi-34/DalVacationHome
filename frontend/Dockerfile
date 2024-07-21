FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm install -g serve --registry=https://registry.npmjs.org/

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]