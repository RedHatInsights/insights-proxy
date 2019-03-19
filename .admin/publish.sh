#!/bin/bash
set -e
docker build -t docker.io/redhatinsights/insights-proxy:cloud .
docker push docker.io/redhatinsights/insights-proxy:cloud
