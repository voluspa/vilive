SHELL=/bin/bash

.PHONY: test server

default: dev

prod:
	ember build --environment production

dev:
	ember build

test:
	ember test

clean:
	rm -rf dist
	rm -rf tmp


env:
	./tools/vilive.tmux

server:
# so the number of file descriptors that testem is juggling
# to auto reload things can blow out the default setting
# which can cause some issues and testem crashing sometimes
	ulimit -n 4096; ./node_modules/nodemon/bin/nodemon.js -w ./server -x ember server

