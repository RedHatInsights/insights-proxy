# insights-proxy

Proxy for the insightsfrontend container

This container uses https://github.com/redhataccess/spandx which provides ESI and some nifty routing tools.

Checkout the `spandx` docs for additional config options.

## Setup

### Setup the initial /etc/hosts entries
```
$ sudo echo -e "\n127.0.0.1 prod.foo.redhat.com stage.foo.redhat.com qa.foo.redhat.com ci.foo.redhat.com" > /etc/hosts
```

### Pull/Update the proxy container
```
$ bash scripts/update.sh
```

## Running the proxy

### Run the container with default options
```
$ bash scripts/run.sh
```

### Options for run.sh

#### Run with the local Legacy Insighs API
```
$ LOCAL_API=true bash scripts/run.sh
```

#### Run with local Insights Chrome
```
$ cd ~/path/to/chrome/directory
$ LOCAL_CHROME=true bash ~/path/to/insights-proxy/scripts/run.sh
```

### Run the container with a custom spandx config
```
$ mkdir -p ./config && touch ./config/spandx.config.js && $EDITOR ./config/spandx.config.js
$ docker run -v $PWD/config:/config --rm --net='host' -p1337:1337 -ti docker.io/iphands/insightsproxy
```

