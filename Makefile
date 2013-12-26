.PHONY: tags

default: tags
	mix

start:
	iex --erl "-config exmud.config" -S mix

tags:
	ctags --exclude=priv -R apps deps
