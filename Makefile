SHELL=/bin/bash

DEV_SCRIPT_DIR?=_build/dev/assets/scripts
PROD_SCRIPT_DIR?=_build/prod/assets/scripts

APP_JS_SRC:=$(shell find app -name "*.js" | xargs)
APP_JS_DEV:=$(patsubst %.js, $(DEV_SCRIPT_DIR)/%.js, $(APP_JS_SRC))
TEMPLATES_SRC:=$(shell find app/templates -name "*.hbs" | xargs)
TEMPLATES_DEV:=$(patsubst %.hbs, $(DEV_SCRIPT_DIR)/%.js, $(TEMPLATES_SRC))
SPEC_JS_SRC:=$(shell find spec -name "*.js" | xargs)
SPEC_JS_DEV:=$(patsubst %.js, $(DEV_SCRIPT_DIR)/%.js, $(SPEC_JS_SRC))

JSHINT?=node_modules/jshint/bin/jshint

MODULE_OPTS?=--infer-name
COMPILE_MODULE?=node_modules/es6-module-transpiler/bin/compile-modules

COMPILE_TEMPLATE?=node tools/compile-templates.js

UGLIFYJS_OPTS?=--compress --mangle
UGLIFYJS?=node_modules/uglify-js/bin/uglifyjs

TESTEM?=node_modules/testem/testem.js

default: ci prod

prod: lint _build $(PROD_SCRIPT_DIR)/app.min.js _build/prod/index.html

dev: lint _build $(APP_JS_DEV) $(TEMPLATES_DEV) $(SPEC_JS_DEV) _build/dev/index.html

ci: dev
	$(TESTEM) ci

lint:
	$(JSHINT) .

clean:
	rm -rf _build


$(PROD_SCRIPT_DIR)/app.min.js: $(TEMPLATES_DEV) $(APP_JS_DEV)
	$(UGLIFYJS) $(TEMPLATES_DEV) $(APP_JS_DEV) $(UGLIFYJS_OPTS) --source-map $@.map --output $@

_build/prod/index.html: app/index.html.hbs
	node tools/generate-index-page.js prod

_build/dev/index.html: app/index.html.hbs
	node tools/generate-index-page.js dev

$(DEV_SCRIPT_DIR)/app/templates/%.js: app/templates/%.hbs
	$(COMPILE_TEMPLATE) -i $< -o $(DEV_SCRIPT_DIR)/app

$(DEV_SCRIPT_DIR)/app/%.js: app/%.js
	$(COMPILE_MODULE) $< --to $(DEV_SCRIPT_DIR) $(MODULE_OPTS)

$(DEV_SCRIPT_DIR)/spec/%.js: spec/%.js
	$(COMPILE_MODULE) $< --to $(DEV_SCRIPT_DIR) $(MODULE_OPTS)

_build:
	mkdir -p $(DEV_SCRIPT_DIR)
	mkdir -p $(PROD_SCRIPT_DIR)

