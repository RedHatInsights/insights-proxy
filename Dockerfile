FROM fedora:29

RUN dnf update -y && \
        dnf install -y nodejs && \
        dnf clean all

COPY ./package.json /package.json
RUN npm install

COPY ./certs /certs
COPY ./ssl /ssl

COPY ./spandx.config.js /spandx.config.js

CMD [ "/usr/bin/node", "/node_modules/spandx/app/cli.js" ]
