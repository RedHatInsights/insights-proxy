#!/bin/bash
source "${BASH_SOURCE%/*}/env.sh"

if $LOCAL_CHROME
then
    docker run -e LOCAL_API -e LOCAL_CHROME -v "$PWD:/chrome" --rm -ti --name insightsproxy --net=host -p 1337:1337 $CONTAINER_URL
else
    docker run -e LOCAL_API --rm -ti --name insightsproxy --net=host -p 1337:1337 $CONTAINER_URL
fi

if $LOCAL_CHROME
then
    MYOPTS="$MYOPTS -e LOCAL_CHROME -v \"$PWD:/chrome\""
fi

if ! $DARWIN
then
    MYOPTS="$MYOPTS --net=host"
fi

docker run $MYOPTS -e PLATFORM -e LOCAL_API --rm -ti --name insightsproxy -p 1337:1337 $CONTAINER_URL
