#!/bin/bash
set -e

NAME=insights-proxy-test
docker build -t $NAME .
clear
docker run --net=host -e PLATFORM=linux --rm -ti --name $NAME --security-opt label=disable $NAME
