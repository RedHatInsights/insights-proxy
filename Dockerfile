FROM node:carbon-alpine

RUN npm install lodash try-require

COPY ./ssl /ssl

RUN apk add --no-cache git && \
    npm install -g spandx@https://github.com/redhataccess/spandx.git#5b53914a22bd43f8b05f51b2aa05c4a0d2ad0cbd && \
    apk del git

COPY ./spandx.config.js ./spandx.config.js

CMD [ "/bin/sh", "-c" , "spandx" ]
