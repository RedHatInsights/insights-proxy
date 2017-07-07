FROM nginx:alpine

# per the https://docs.openshift.com/enterprise/3.0/creating_images/guidelines.html#use-uid
RUN chmod 777 -R /var/log/nginx && chmod 777 -R /var/cache/nginx

EXPOSE 1337
STOPSIGNAL SIGTERM

RUN  mkdir /etc/nginx/ssl
COPY cert.pem /etc/nginx/ssl/
COPY key.pem /etc/nginx/ssl/
COPY start-it /usr/local/bin/start-it

# USER nginx
# USER 100
COPY base.nginx.tpl base.nginx.tpl
COPY server.nginx.tpl server.nginx.tpl
CMD [ "/bin/sh", "/usr/local/bin/start-it" ]

