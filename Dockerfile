FROM node:carbon-alpine

RUN npm install -g spandx
RUN npm install lodash try-require


COPY ./spandx.config.js ./spandx.config.js
COPY ./patches /patches
COPY ./ssl /ssl

RUN cd /usr/local/lib/node_modules/spandx && cat /patches/spandx.allowAllowedHostsInEsiConfig.patch | patch -p1
RUN cd /usr/local/lib/node_modules/spandx/node_modules/nodesi && cat /patches/nodesi.fixRegexps.patch | patch -p1

# CMD [ "cat", "spandx.config.js" ]
CMD [ "spandx" ]
