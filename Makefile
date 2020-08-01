DATE=$(shell date --iso-8601=minutes)

SOURCES=$(shell find . -name '*.md')
HTML_FILES := $(patsubst %.md,%.html,$(SOURCES))
TARGETS := $(addprefix _site/, $(HTML_FILES))


.PHONY: all
all: $(TARGETS) _site/index.html _site/static


_site/%.html: %.md pandoc/tufte.html5
	mkdir -p $(dir $@)
	pandoc --standalone \
		--toc \
		--section-divs \
		--to html5 \
		--template pandoc/tufte.html5 \
		--output $@ \
		$<

_site/static: static
	cp -r $< $@

.PHONY: entr
entr:
	(find . -name '*.md' ; ls pandoc/tufte.html5) | entr -c bash -c 'make'
