#!/bin/bash
set -e
VERSION="`node -p -e "require('./package.json').version"`"
docker build -t docker.io/redhatinsights/insights-proxy:$VERSION .
docker push docker.io/redhatinsights/insights-proxy:$VERSION

docker tag docker.io/redhatinsights/insights-proxy:$VERSION docker.io/redhatinsights/insights-proxy:latest
docker push docker.io/redhatinsights/insights-proxy:latest
