#!/bin/bash
set -e

NAME=insights-proxy-test
docker build -t $NAME .
docker run --net=host -e PLATFORM=linux --rm -ti --name $NAME --security-opt label=disable -p 1337:1337 $NAME /bin/sh
