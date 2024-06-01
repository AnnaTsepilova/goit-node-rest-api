FROM node:20.14-alpine

WORKDIR /usr/src/app

COPY ./ /usr/src/app
RUN npm ci

EXPOSE 3000/tcp

CMD ["npm","start"]