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
