SHELL=/bin/bash

# output directory paths
DEV_SCRIPT_DIR?=_build/dev/assets/scripts
DEV_STYLE_DIR?=_build/dev/assets/styles

PROD_SCRIPT_DIR?=_build/prod/assets/scripts
PROD_STYLE_DIR?=_build/prod/assets/styles

# source globs
APP_JS_SRC:=$(shell find app -name "*.js" | xargs)
APP_JS_DEV:=$(patsubst %.js, $(DEV_SCRIPT_DIR)/%.js, $(APP_JS_SRC))

TEMPLATES_SRC:=$(shell find app/templates -name "*.hbs" | xargs)
TEMPLATES_DEV:=$(patsubst %.hbs, $(DEV_SCRIPT_DIR)/%.js, $(TEMPLATES_SRC))

STYLES_SRC:=$(shell find app/styles -name "*.less" | xargs)

SPEC_JS_SRC:=$(shell find spec -name "*.js" | xargs)
SPEC_JS_DEV:=$(patsubst %.js, $(DEV_SCRIPT_DIR)/%.js, $(SPEC_JS_SRC))


# commands
JSHINT?=node_modules/jshint/bin/jshint

COMPILE_MODULE?=node_modules/es6-module-transpiler/bin/compile-modules
MODULE_OPTS?=--infer-name

COMPILE_TEMPLATE?=node tools/compile-templates.js

LESSC?=node_modules/less/bin/lessc
LESSC_OPTS?=--source-map --include-path=app/styles

UGLIFYJS?=node_modules/uglify-js/bin/uglifyjs
UGLIFYJS_OPTS?=--compress --mangle

TESTEM?=node_modules/testem/testem.js


default: dev prod ci

prod: lint _build $(PROD_SCRIPT_DIR)/app.min.js $(PROD_STYLE_DIR)/application.css _build/prod/index.html

dev: lint _build $(APP_JS_DEV) $(TEMPLATES_DEV) $(DEV_STYLE_DIR)/application.css $(SPEC_JS_DEV) _build/dev/index.html

ci: dev
	$(TESTEM) ci

lint:
	$(JSHINT) .

clean:
	rm -rf _build


$(PROD_SCRIPT_DIR)/app.min.js: $(TEMPLATES_DEV) $(APP_JS_DEV)
	$(UGLIFYJS) $(TEMPLATES_DEV) $(APP_JS_DEV) $(UGLIFYJS_OPTS) --source-map $@.map --output $@

$(PROD_STYLE_DIR)/application.css: $(STYLES_SRC)
	$(LESSC) $(LESSC_OPTS) -x app/styles/application.less $@

_build/prod/index.html: $(APP_JS_SRC) $(STYLES_JS_SRC) app/index.html.hbs bower.json tools/generate-index-page.js
	node tools/generate-index-page.js prod


$(DEV_SCRIPT_DIR)/app/templates/%.js: app/templates/%.hbs
	$(COMPILE_TEMPLATE) -i $< -o $(DEV_SCRIPT_DIR)/app

$(DEV_SCRIPT_DIR)/app/%.js: app/%.js
	$(COMPILE_MODULE) $< --to $(DEV_SCRIPT_DIR) $(MODULE_OPTS)

$(DEV_SCRIPT_DIR)/spec/%.js: spec/%.js
	$(COMPILE_MODULE) $< --to $(DEV_SCRIPT_DIR) $(MODULE_OPTS)

$(DEV_STYLE_DIR)/application.css: $(STYLES_SRC)
	$(LESSC) $(LESSC_OPTS) app/styles/application.less $@

_build/dev/index.html: $(APP_JS_SRC) $(STYLES_JS_SRC) app/index.html.hbs bower.json tools/generate-index-page.js
	node tools/generate-index-page.js dev


_build:
	mkdir -p $(DEV_SCRIPT_DIR)
	mkdir -p $(PROD_SCRIPT_DIR)

