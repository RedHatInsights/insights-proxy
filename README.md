This project is deprecated. [Please use the webpack proxy](https://github.com/RedHatInsights/frontend-components/tree/master/packages/config#useproxy)

# insights-proxy

Proxy for the insightsfrontend container

This container uses https://github.com/redhataccess/spandx which provides ESI and some nifty routing tools.

Checkout the `spandx` docs for additional config options.

## Setup

### Setup the initial /etc/hosts entries (do this once)
```
$ sudo bash scripts/patch-etc-hosts.sh
```

### Pull/Update the proxy container
```
$ bash scripts/update.sh
```

## Running the proxy (for users)

### Run the container with default options
```
$ bash scripts/run.sh
```

## Options for run.sh

### Run the container with spandx config overrides
```
$ SPANDX_CONFIG=/path/to/custom/config.js bash ~/path/to/insights-proxy/scripts/run.sh
```

### Run the container with cloud proxy

In order to run the container with cloud.redhat.com as main source of data you have to set `USE_CLOUD` env variable.
```
$ USE_CLOUD=true ~/path/to/insights-proxy/scripts/run.sh
```

### Run with local Insights Chrome (for chrome developers only)
This is for Chrome developers only.
If you are developing an application on the platform you need not do this!

```
$ cd ~/path/to/chrome/directory
$ LOCAL_CHROME=true bash ~/path/to/insights-proxy/scripts/run.sh
```

## Additional Notes

### Virtualbox users (just dont Vbox though...)

Note to macOS and Windows users using [Docker Machine](https://docs.docker.com/machine/): You have to set-up forwarding of the port 1337 through the VirtualBox network interface. The machine has to be stopped for this command to succeed.

```
VBoxManage modifyvm "default" --natpf1 "insights,tcp,,1337,,1337"
```

### Docker vs Podman

Due to previous issues with podman, the current default is docker.  Can pass `RUNNER=podman` or `RUNNER=docker` environment variable to override.

### Docker Version

The insights-proxy container utilizes several rewrite rules; including one for `host.docker.internal` which will resolve to the internal IP address used by the host. This special DNS name is stable from version *18.03* for Linux & macOS, however for previous versions the DNS name varied for macOS, see [Stack Overflow](https://stackoverflow.com/questions/31324981/how-to-access-host-port-from-docker-container/43541732#43541732). If you are using a version of Docker older than *18.03* on macOS, you will need to either upgrade your Docker version or update you spandx.config.js to map to the appropriate DNS name for your version.
