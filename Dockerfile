FROM node:carbon-alpine

COPY ./package.json /package.json
RUN npm install

COPY ./certs /certs
COPY ./ssl /ssl
COPY ./patches /patches
RUN cd /node_modules/spandx && cat /patches/spandx.plugin.patch | patch -p1

COPY ./spandx.config.js /spandx.config.js

CMD [ "/usr/local/bin/node", "/node_modules/spandx/app/cli.js" ]
