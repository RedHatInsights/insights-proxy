FROM node:carbon-alpine

COPY ./package.json /package.json
RUN npm install

COPY ./certs /certs
COPY ./ssl /ssl

COPY ./spandx.config.js /spandx.config.js

CMD [ "/usr/local/bin/node", "/node_modules/spandx/app/cli.js" ]
