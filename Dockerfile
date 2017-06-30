FROM nginx:alpine

# per the https://docs.openshift.com/enterprise/3.0/creating_images/guidelines.html#use-uid
RUN chmod 777 -R /var/log/nginx && chmod 777 -R /var/cache/nginx

EXPOSE 1337
STOPSIGNAL SIGTERM

RUN  mkdir /etc/nginx/ssl
COPY cert.pem /etc/nginx/ssl/
COPY key.pem /etc/nginx/ssl/
COPY insights-proxy.conf /etc/nginx/insights-proxy.conf
COPY insights-proxy-nocontent.conf /etc/nginx/insights-proxy-nocontent.conf

# USER nginx
USER 100
CMD nginx  -c "/etc/nginx/${CONF}" -g "daemon off;"

