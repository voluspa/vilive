SHELL=/bin/bash

ISTANBUL?=./node_modules/istanbul/lib/cli.js
TESTEM?=./node_modules/testem/testem.js
COVERALLS?=./node_modules/coveralls/bin/coveralls.js
ENV?=development

.PHONY: test server

default: dev

prod:
	ember build --environment production

dev:
	ember build --environment $(ENV)

ci:
	echo 'make sure server is running: ember server --environment test'
	cd dist; ../$(ISTANBUL) instrument assets/vilive.js --output assets/vilive.instrumented.js
	cd dist; ../$(TESTEM) ci -f ../testem.json
	$(ISTANBUL) check-coverage

cover-report:
	$(ISTANBUL) report

cover-post: cover-report
	cat ./coverage/lcov.info | $(COVERALLS)

clean:
	rm -rf dist
	rm -rf tmp

purge: clean
	rm -rf node_modules
	rm -rf vendor
	git checkout -- vendor

install:
	npm install
	bower install


env:
	./tools/vilive.tmux

server:
# so the number of file descriptors that testem is juggling
# to auto reload things can blow out the default setting
# which can cause some issues and testem crashing sometimes
	ulimit -n 4096; ./node_modules/nodemon/bin/nodemon.js -w ./server -x ember server --environment $(ENV)

