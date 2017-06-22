FROM nginx:alpine

# per the https://docs.openshift.com/enterprise/3.0/creating_images/guidelines.html#use-uid
RUN chmod 777 -R /var/log/nginx && chmod 777 -R /var/cache/nginx

RUN sed 's|pid[ ]*/var/run/nginx.pid;|pid /tmp/nginx.pid;|' -i /etc/nginx/nginx.conf
RUN sed 's|user[ ]*nginx;||' -i /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 1337
STOPSIGNAL SIGTERM

RUN  mkdir /etc/nginx/ssl
COPY cert.pem /etc/nginx/ssl/
COPY key.pem /etc/nginx/ssl/
COPY insights-proxy.conf /etc/nginx/conf.d/insights-proxy.conf

# USER nginx
USER 100
CMD ["nginx", "-g", "daemon off;"]
