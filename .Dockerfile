FROM node:10.19.0-alpine3.9

WORKDIR /usr/app

COPY package.json ./
COPY tsconfig.json ./
COPY .env ./
ADD src ./src/

RUN npm install
RUN npm install -g typescript@3.8.3

EXPOSE 3000

CMD ["npm","run","start:dev"]