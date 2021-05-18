FROM fedora:33

RUN dnf update -y && \
        dnf install -y dumb-init nodejs && \
        dnf clean all

COPY ./package.json /package.json
RUN npm install

COPY ./certs /certs
COPY ./ssl /ssl

COPY ./spandx.config.js /spandx.config.js

# dumb-init being PID1 allows SIGTERM etc. to reach the node process.
CMD [ "/usr/bin/dumb-init", "/usr/bin/node", "/node_modules/spandx/app/cli.js" ]
