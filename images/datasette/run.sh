#! /usr/bin/env bash

# This script is the main script called within the Docker container.

nginx -c /etc/nginx/nginx.conf

sqlite3 /usr/share/datasette/example.db 'select sqlite_version();'

datasette -p 9001 -h 0.0.0.0 \
  --template-dir /usr/share/datasette/templates \
  --static static:/usr/share/nginx/html/static/ \
  --config base_url:/datasette/ \
  /usr/share/datasette/example.db 
