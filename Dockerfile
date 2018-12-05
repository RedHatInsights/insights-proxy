FROM fedora:29

RUN dnf update -y && \
        dnf install -y nodejs && \
        dnf clean all && \
        rpm -ve `rpm -qa --queryformat='%{NAME}\n' | fgrep -e rpm -e dnf -e libsolv -e python -e unbound` && \
        rm -rf /tmp/* && \
        rm -rf /var/cache/* && \
        rm -rf /var/lib/rpm/* && \
        rm -rf /var/lib/dnf/* && \
        rm -rf /usr/lib/python* && \
        rm -rf /usr/lib64/python* && \
        rm -rf /var/log/*

COPY ./package.json /package.json
RUN npm install

COPY ./certs /certs
COPY ./ssl /ssl

COPY ./spandx.config.js /spandx.config.js

CMD [ "/usr/bin/node", "/node_modules/spandx/app/cli.js" ]
