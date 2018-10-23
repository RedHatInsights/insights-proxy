#!/bin/bash
source "${BASH_SOURCE%/*}/env.sh"

if $CI_ENV
then
    MYOPTS="$MYOPTS -e CI_ENV"
fi

if $QA_ENV
then
    MYOPTS="$MYOPTS -e QA_ENV"
fi

if $STAGE_ENV
then
    MYOPTS="$MYOPTS -e STAGE_ENV"
fi

if $LOCAL_CHROME
then
    MYOPTS="$MYOPTS -e LOCAL_CHROME -v $PWD:/chrome"
fi

if $LOCAL_CHROME
then
    MYOPTS="$MYOPTS -e LOCAL_CHROME -v $PWD:/chrome"
fi

if [[ -v SPANDX_CONFIG ]]
then
    if [[ ! -f $SPANDX_CONFIG ]]
    then
        echo >&2 "$SPANDX_CONFIG does not point to a file!"
        exit 1
    fi

    MYOPTS="$MYOPTS -v $SPANDX_CONFIG:/config/spandx.config.js"
fi

if [ "$PLATFORM" == "linux" ]
then
    MYOPTS="$MYOPTS --net=host"
fi

docker run $MYOPTS -e PLATFORM -e PORT -e LOCAL_API -e SPANDX_HOST -e SPANDX_PORT --rm -ti --name insightsproxy -p ${SPANDX_PORT:-1337}:${SPANDX_PORT:-1337} $CONTAINER_URL
