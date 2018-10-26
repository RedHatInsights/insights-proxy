FROM node:carbon-alpine

COPY ./package.json /package.json
RUN npm install

COPY ./ssl /ssl
COPY ./patches /patches
COPY ./certs /certs
COPY ./spandx.config.js /spandx.config.js

RUN cd /node_modules/spandx && cat /patches/spandx.plugin.patch | patch -p1

CMD [ "/usr/local/bin/node", "/node_modules/spandx/app/cli.js" ]
