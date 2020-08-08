#! /usr/bin/env bash

# This runs browser-sync, watching the ../_site directories for changes. You
# should simply point your web browser to http://localhost:3004/.

docker kill sync-alt-design
docker rm sync-alt-design
docker run \
  -dt \
  --name sync-alt-design \
  -p 3004:3000 \
  -p 3005:3001 \
  -v $(pwd)/_site:/source \
  -w /source \
  browser-sync \
  /run.sh
