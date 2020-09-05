# Build as datasette-with-plugins.
#
# This is a Datasette Docker image that includes some Datasette plugins but
# also Nginx. Placing Nginx as a reverse proxy in front of Datasette gives
# additional flexibility (e.g. recognising virtual hosts). It is also possible
# that Datasette is not completely comfortable with modified routes:
# https://github.com/simonw/datasette/issues/900.
#
# In addition to this image, this repository has its own set of templates in
# datasette/templates/.

FROM nixos/nix AS builder

# TODO Use NIX_PATH instead of channels.
RUN nix-channel --add https://nixos.org/channels/nixpkgs-unstable nixpkgs
RUN nix-channel --update

# Pre-run to download the dependencies:
RUN nix-shell -p entr gnumake \
  "haskellPackages.ghcWithPackages (pkgs: [pkgs.pandoc])" \
  --run 'pandoc --version'

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN mkdir -p _site ; cp -r static _site/static
RUN nix-shell -p entr gnumake \
  "haskellPackages.ghcWithPackages (pkgs: [pkgs.pandoc])" \
  --run 'make'


FROM datasetteproject/datasette

RUN pip install csvs-to-sqlite datasette-json-html

RUN apt-get update \
  && apt-get install -y nginx \
  && apt-get clean

RUN rm /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/_site /usr/share/nginx/html
ADD images/datasette/run.sh /
ADD images/datasette/nginx-default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /usr/share/datasette
COPY datasette/templates /usr/share/datasette/templates
RUN csvs-to-sqlite --table example_00 \
  /usr/share/nginx/html/data/example-00.csv \
  /usr/share/datasette/main.db
RUN csvs-to-sqlite --table example_01 \
  /usr/share/nginx/html/data/example-01.csv \
  /usr/share/datasette/main.db

CMD /run.sh
