# insights-proxy
Proxy for the insightsfrontend container


## Do these once
```
$ sudo docker pull iphands/insightsproxy:latest
$ sudo docker pull iphands/insightsfrontend:latest
$ sudo echo -e "\n127.0.0.1 prod.foo.redhat.com" > /etc/hosts
```

## Do these each time you want to run the env
```
$ sudo docker run --net="host" -p1337:1337 iphands/insightsproxy
$ sudo docker run -p9000:8080 iphands/insightsfrontend:latest
$ firefox https://prod.foo.redhat.com:1337/insightsbeta/
```
