---
title: alt-design
---

<section>

The central element of this repository[^compl] is a Pandoc template used to
render Markdown files to HTML. The basis is from
[jez/tufte-pandoc-css](https://github.com/jez/tufte-pandoc-css), itself based
on [edwardtufte/tufte-css](https://github.com/edwardtufte/tufte-css).

[^compl]:
  It is complementary to
  [hypered/design](https://github.com/hypered/design).

</section>


# Building

Building the static HTML files is done by the `Makefile`. A helper script that
includes a Nix-based sha-bang is provided:

```
$ script/build.sh
```

That script is also used within the `Dockerfile` and the GitHub Action. The
result is pushed to GitHub Pages (and thus doesn't provide the Datasette
backend).


# Running locally

There is a also helper script based on `entr` to continuously rebuild the `_site`
directory whenever a source file changes:

```
$ scripts/entr.sh
```

It is recommended to serve the `_site/` directory with Browsersync.


# Docker image

A Docker image is provided. It contains a Nginx server made to serve the
rendered Markdown files (together with their static assets) and also Datasette,
which can be used to explore a SQLite database, or to provide data to the
`D3.js` graphs demonstrated below.

To build it, use `scripts/build-docker-image.sh`, and to run it, use
`scripts/run-datasette-image.sh`.


# Datasette

When deployed (e.g. using the Docker image above), a Datasette instance should
be exposed on [`/datasette/`](/datasette/).


# Details

- Use Pandoc to render Markdown files to HTML
- Use (a modified) Tufte CSS with the IBM Plex font
- Use Pandoc filters:
   - `pandoc-sidenote`
- Use a `Makefile` to rebuild only what needs to be rebuilt

The `datasette/templates/` directory has been created by (`2aca479` was a
previously run of a Docker container):

```
$ docker cp 2aca479:/usr/local/lib/python3.7/site-packages/datasette/templates .
```

The version was `datasette, version 0.45+0.gf1f581b.dirty`.

Note: it's interesting to know that the [Datasette Docker
image](https://github.com/simonw/datasette/blob/master/Dockerfile) is based on
Debian:

```
$ docker run datasetteproject/datasette cat /etc/debian_version
9.8
```


# Adding graphs

In the margin, there is an example horizontal bar chart.[^bar] The displayed
data are random values and don't represent anything meaningful.

It is created by a bit of `D3.js` code, and by placing the following line in
the source of this page:

```
<svg data-graph="horizontal-bar" data-csv="/data/example-00.csv"></svg>
```

[^bar]:
  {-} `example-00`: <svg data-graph="horizontal-bar" data-csv="/datasette/main.csv?sql=select+*+from+example_00&_size=max" data-color="blue"></svg><br>
  <small>View data [in Datasette](/datasette/main?sql=select+*+from+example_00).</small>

TODO: The graph code is not re-executed when the margin note is initially
hidden then made visible, or when the window is resized.

<figure>
<svg data-graph="line" data-csv="/datasette/main.csv?sql=select+*+from+example_01&_size=max"></svg>[^links]
</figure>

[^links]:
  {-} <small>View this graph [in fullpage](/fullscreen.html).</small>
      <small>View data [in Datasette](/datasette/main?sql=select+*+from+example_01).</small>


The style of the graphs, some of their underlying code, and their data come
originally from
[goodwill.awardwinninghuman.com](https://goodwill.awardwinninghuman.com/).

<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/d3-array.v2.min.js"></script>
<script src="https://d3js.org/topojson.v2.min.js"></script>
<script type="text/javascript" src="/static/js/graphs/example-00.js"></script>
