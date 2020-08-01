DATE=$(shell date --iso-8601=minutes)

SOURCES=$(shell find . -name '*.md')
HTML_FILES := $(patsubst %.md,%.html,$(SOURCES))
TARGETS := $(addprefix _site/, $(HTML_FILES))


.PHONY: all
all: $(TARGETS) _site/index.html _site/static/css/tufte.css _site/static/css/et-book.css


_site/%.html: %.md pandoc/tufte.html5
	mkdir -p $(dir $@)
	pandoc --standalone \
		--toc \
		--section-divs \
		--to html5 \
		--template pandoc/tufte.html5 \
		--output $@ \
		$<

_site/%.css: %.css
	cp $< $@

.PHONY: entr
entr:
	(find . -name '*.md' ; find static -name '*.css' ; ls Makefile pandoc/tufte.html5) \
		| entr -c bash -c 'make'
