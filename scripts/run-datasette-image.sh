#! /usr/bin/env bash

docker rm -f datasette > /dev/null 2>&1
docker run -d -p 9002:80 -p 9001:9001 --name datasette datasette-with-plugins
