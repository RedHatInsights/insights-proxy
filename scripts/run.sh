#!/bin/bash
source "${BASH_SOURCE%/*}/env.sh"

if $LOCAL_CHROME
then
    docker run -e LOCAL_API -e LOCAL_CHROME -v "$PWD:/chrome" --rm -ti --name insightsproxy --net=host -p 1337:1337 $CONTAINER_URL
else
    docker run -e LOCAL_API --rm -ti --name insightsproxy --net=host -p 1337:1337 $CONTAINER_URL
fi
