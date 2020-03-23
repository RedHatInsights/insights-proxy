#!/bin/bash
set -a

# Respect RUNNER env var if set.
# Defaulting to docker - podman keeps not cleaning up after itself.
RUNNER=${RUNNER:-docker}

CONTAINER_URL=${CONTAINER_URL:-docker.io/redhatinsights/insights-proxy}
case "`uname -s`" in
    Linux*)
        LINUX=true
        PLATFORM=linux;;
    Darwin*)
        DARWIN=true
        PLATFORM=darwin;;
    *)
        echo 'This only works on Linux or Darwin!'
        exit 1;;
esac
