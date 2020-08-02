# Build as datasette-with-plugins.
#
# This is a Datasette Docker image that includes some Datasette plugins but
# also Nginx. Placing Nginx as a reverse proxy in front of Datasette gives
# additional flexibility (e.g. recognising virtual hosts). It is also possible
# that Datasette is not completely comfortable with modified routes:
# https://github.com/simonw/datasette/issues/900.

FROM datasetteproject/datasette

RUN pip install datasette-json-html

RUN apt-get update \
  && apt-get install -y nginx \
  && apt-get clean

RUN rm /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
