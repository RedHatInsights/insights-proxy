#!/bin/bash
source "${BASH_SOURCE%/*}/env.sh"
docker pull $CONTAINER_URL
