FROM node:carbon-alpine

RUN npm install lodash try-require jsonwebtoken base-64 cookie

RUN npm install -g spandx

COPY ./ssl /ssl

COPY ./patches /patches

COPY ./certs /certs

RUN cd /usr/local/lib/node_modules/spandx && cat /patches/spandx.plugin.patch | patch -p1

COPY ./spandx.config.js ./spandx.config.js

RUN ls -lh; pwd

CMD [ "/bin/sh", "-c" , "spandx" ]
