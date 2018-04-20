# insights-proxy

Proxy for the insightsfrontend container

This container uses https://github.com/redhataccess/spandx which provides ESI and some nifty routing tools.

Checkout the `spandx` docs for additional config options.

## Setup
### Setup the initial /etc/hosts entries
```
$ sudo echo -e "\n127.0.0.1 prod.foo.redhat.com stage.foo.redhat.com qa.foo.redhat.com ci.foo.redhat.com" > /etc/hosts
```

### Pull the proxy container
```
$ sudo docker pull iphands/insightsproxy:spandx
```

## Running the proxy

### Run the container with default options
```
$ docker run --rm --net='host' -p1337:1337 -ti iphands/insightsproxy:spandx
```

### Run the container with custom spandx config
```
$ mkdir -p ./config && touch ./config/spandx.config.js && $EDITOR ./config/spandx.config.js
$ docker run -v $PWD/config:/config --rm --net='host' -p1337:1337 -ti iphands/insightsproxy:spandx
```
