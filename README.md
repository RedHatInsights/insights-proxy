# insights-proxy
Proxy for the insightsfrontend container


## Do these once
```
$ sudo docker pull iphands/insightsproxy:latest
$ sudo docker pull iphands/insightsfrontend:latest
$ sudo echo -e "\n127.0.0.1 prod.foo.redhat.com" > /etc/hosts
```

## Do these each time you want to run the env

### To run with local /static content (developer mode)
```
$ docker run --net='host' -e MODE=all/content -p1337:1337 -ti iphands/insightsproxy
$ sudo docker run -p9000:8080 iphands/insightsfrontend:latest
$ firefox https://prod.foo.redhat.com:1337/insightsbeta/
```

### To run without local /static content (demo mode)
```
$ docker run --net='host' -e MODE=prod/nocontent -p1337:1337 -ti iphands/insightsproxy
$ sudo docker run -p9000:8080 iphands/insightsfrontend:latest
$ firefox https://prod.foo.redhat.com:1337/insightsbeta/
```
