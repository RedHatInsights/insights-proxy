#!/bin/bash
source "${BASH_SOURCE%/*}/env.sh"
$RUNNER pull $CONTAINER_URL
