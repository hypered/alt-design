---
title: alt-design
---

<section>

The central element of this repository[^compl] is a Pandoc template used to
render Markdown files to HTML. The basis is from
https://github.com/jez/tufte-pandoc-css, itself based on
https://github.com/edwardtufte/tufte-css.

[^compl]:
  It is complementary to https://github.com/hypered/design-system.

</section>


# Running locally

There is a helper script based on `entr` to continuously rebuild the `_site`
directory:

```
$ scripts/entr.sh
```

It is recommended to serve the `_site/` directory with Browsersync.


# Details

- Use Pandoc to render Markdown files to HTML
- Use (a modified) Tufte CSS with the IBM Plex font
- Use Pandoc filters:
   - `pandoc-sidenote`
- Use a `Makefile` to rebuild only what needs to be rebuild

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
  {-} `example-00`: <svg data-graph="horizontal-bar" data-csv="/data/example-00.csv" data-color="blue"></svg>

TODO: The graph code is not re-executed when the margin note is initially
hidden then made visible, or when the window is resized.

<figure>
<svg data-graph="line" data-csv="/data/example-01.csv"></svg>[^links]
</figure>

[^links]:
  {-} View this graph in [fullpage](/fullscreen.html).
      View the [CSV data](/data/example-01.csv).


The style of the graphs, some of their underlying code, and their data come
originally from
[goodwill.awardwinninghuman.com](https://goodwill.awardwinninghuman.com/).

<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/d3-array.v2.min.js"></script>
<script src="https://d3js.org/topojson.v2.min.js"></script>
<script type="text/javascript" src="/static/js/graphs/example-00.js"></script>
