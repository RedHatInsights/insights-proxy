FROM node:carbon-alpine

RUN npm install lodash try-require

COPY ./ssl /ssl

RUN apk add --no-cache git && \
    npm install -g spandx && \
    apk del git

COPY ./spandx.config.js ./spandx.config.js

CMD [ "/bin/sh", "-c" , "spandx" ]
