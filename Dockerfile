FROM node:18.4.0-alpine

RUN apk update && apk add bash

ADD ./ /fong-tron

WORKDIR /fong-tron

RUN npm install

ENTRYPOINT ["/fong-tron/run-server.sh"]
