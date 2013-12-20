.PHONY: tags

default: tags
	mix

start:
	iex --erl "-config exmud.config" -S mix

tags:
	ctags -R apps deps
