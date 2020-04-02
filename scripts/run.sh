#!/bin/bash
source "${BASH_SOURCE%/*}/env.sh"

if [[ -n "$LOCAL_CHROME" ]]
then
    MYOPTS="$MYOPTS -e LOCAL_CHROME -v $PWD:/chrome"
fi

# instead of using -v use -n to check for an empty strings
# -v is not working well on bash 3.2 on osx
if [[ -n "$SPANDX_CONFIG" ]]
then
    REALPATH=`python2 -c 'import os,sys;print os.path.realpath(sys.argv[1])' $SPANDX_CONFIG`

    if [[ ! -f $REALPATH ]]
    then
        echo >&2 "$SPANDX_CONFIG does not point to a file!"
        exit 1
    fi

    MYOPTS="$MYOPTS -e CUSTOM_CONF=true"
    MYOPTS="$MYOPTS -v $REALPATH:/config/spandx.config.js"
fi

if [ "$PLATFORM" == "linux" ]
then
    MYOPTS="$MYOPTS --net=host"
fi

# early versions of podman errored when a env var was exported and unset
# https://github.com/containers/libpod/issues/1663
function conditional_add_param() {
    env | grep -q "^$1="
    if [ $? -eq 0 ]
    then
        MYOPTS="$MYOPTS -e $1"
    fi
}

for var in PLATFORM PORT LOCAL_API LOCAL_API_PORT LOCAL_API_SCHEME SPANDX_HOST SPANDX_PORT NO_LOCALHOST_REWRITE
do
    conditional_add_param $var
done

set -x
exec $RUNNER run $MYOPTS \
        --rm \
        -ti \
        --name insightsproxy \
        --security-opt label=disable \
        -p ${SPANDX_PORT:-1337}:${SPANDX_PORT:-1337} \
        $CONTAINER_URL
