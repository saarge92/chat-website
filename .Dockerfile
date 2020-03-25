FROM node:10.19.0-alpine3.9

WORKDIR /usr/app

ADD package.json ./
ADD tsconfig.json ./

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm","run","start:prod"]