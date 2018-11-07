FROM node:carbon-alpine

RUN apk update && apk upgrade && apk add --no-cache git

COPY ./package.json /package.json
RUN npm install

COPY ./certs /certs
COPY ./ssl /ssl

COPY ./spandx.config.js /spandx.config.js

CMD [ "/usr/local/bin/node", "/node_modules/spandx/app/cli.js" ]
