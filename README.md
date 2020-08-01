---
title: alt-design
---

<section>

The central element of this repository is a Pandoc template used to render
Markdown files to HTML. The basis is from
https://github.com/jez/tufte-pandoc-css, itself based on
https://github.com/edwardtufte/tufte-css.

It is complementary to https://github.com/hypered/design-system.

</section>


# Running locally

There is a helper script based on `entr` to continuously rebuild the `_site`
directory:

```
$ scripts/entr.sh
```

It is recommended to serve the `_site/` directory with Browsersync.
