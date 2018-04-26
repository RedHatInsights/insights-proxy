FROM node:carbon-alpine

RUN npm install lodash try-require

COPY ./ssl /ssl

RUN npm install -g spandx && echo 000
COPY ./spandx.config.js ./spandx.config.js

CMD [ "/bin/sh", "-c" , "spandx" ]
