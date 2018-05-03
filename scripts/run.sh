#!/bin/bash
source "${BASH_SOURCE%/*}/env.sh"

if $LOCAL_CHROME
then
    MYOPTS="$MYOPTS -e LOCAL_CHROME -v $PWD:/chrome"
fi

if [ "$PLATFORM" == "linux" ]
then
    MYOPTS="$MYOPTS --net=host"
fi

docker run $MYOPTS -e PLATFORM -e PORT -e LOCAL_API --rm -ti --name insightsproxy -p 1337:1337 $CONTAINER_URL
