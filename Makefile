DATE=$(shell date --iso-8601=minutes)

SOURCES=$(shell find . -name '*.md')
HTML_FILES := $(patsubst %.md,%.html,$(SOURCES))
TARGETS := $(addprefix _site/, $(HTML_FILES))


.PHONY: all
all: $(TARGETS) \
  _site/data/example-00.csv \
  _site/data/example-01.csv \
  _site/static/css/et-book.css \
  _site/static/css/ibm-plex.css \
  _site/static/css/tufte.css \
  _site/static/css/tufte-hypered.css \
  _site/static/css/fullscreen.css \
  _site/static/js/graphs/example-00.js

_site/index.html: _site/README.html
	mkdir -p $(dir $@)
	cp $< $@

_site/%.html: %.md pandoc/tufte.html5
	mkdir -p $(dir $@)
	pandoc --standalone \
		--toc \
		--section-divs \
		--to html5 \
		--template pandoc/tufte.html5 \
		--filter filters/pandoc-sidenote.hs \
		--output $@ \
		$<

_site/data/%.csv: data/%.csv
	mkdir -p $(dir $@)
	cp $< $@

_site/%.css: %.css
	mkdir -p $(dir $@)
	cp $< $@

_site/%.js: %.js
	mkdir -p $(dir $@)
	cp $< $@

.PHONY: entr
entr:
	(find . -name '*.md' ; find static -name '*.css' -o -name '*.js' ; find data -name '*.csv' ; ls Makefile pandoc/tufte.html5) \
		| entr -c bash -c 'make'
