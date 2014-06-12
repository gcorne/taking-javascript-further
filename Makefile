
# Get Makefile directory name: http://stackoverflow.com/a/5982798/376773.
# This is a defensive programming approach to ensure that this Makefile
# works even when invoked with the `-C`/`--directory` option.
THIS_MAKEFILE_PATH:=$(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
THIS_DIR:=$(shell cd $(dir $(THIS_MAKEFILE_PATH));pwd)

# BIN directory
BIN := $(THIS_DIR)/node_modules/.bin

# applications
NODE ?= node
NPM ?= $(NODE) $(shell which npm)
JADE ?= $(NODE) $(BIN)/jade
STYL ?= $(NODE) $(BIN)/styl
NPM_DEPS ?= $(NODE) $(BIN)/npm-deps
BROWSERIFY ?= $(NODE) $(BIN)/browserify

JADE_FILES := $(wildcard client/*/*.jade) $(wildcard server/*/*.jade)
STYL_FILES := $(wildcard client/*/*.styl) $(wildcard server/*/*.styl)
PACKAGE_JSON_FILES := package.json $(wildcard client/*/package.json) $(wildcard server/*/package.json)

# variables
NODE_ENV ?= development
NODE_PATH ?= server

export NODE_ENV := $(NODE_ENV)
export NODE_PATH := $(NODE_PATH)

# The `run` task is the default rule in the Makefile.
# Simply running `make` by itself will spawn the Node.js server instance.
run: install
	@$(NODE) index.js

# alias to the `node_modules` rule
install: node_modules

# a helper rule to ensure that a specific module is installed,
# without relying on a generic `npm install` command
node_modules/%:
	@$(NPM) install $(notdir $@)

# ensures that the `node_modules` directory is installed and up-to-date with
# the dependencies listed in the "package.json" file. Invokes `npm-deps`
# before spawning `npm` so that the client and server dependencies are installed.
node_modules: node_modules/npm-deps $(PACKAGE_JSON_FILES)
	@-git checkout -- package.json
	@$(NPM_DEPS) -o package.json
	@$(NPM) install
	@touch node_modules


# bundle client-side `*.js` files into the `public/build.js` file
public/build.js: $(wildcard client/*/*.js) node_modules
	@NODE_PATH=$(THIS_DIR)/client $(BROWSERIFY) \
		client/boot \
		> $@

# the `make build` rule is just an aggregate of some specific file rules
build: public/build.js

# the `clean` rule deletes all the files created from `make build`
clean:
	@rm -rf public/build.js

# the `distclean` rule deletes all the files created from `make install`
distclean:
	@rm -rf node_modules client/*/node_modules server/*/node_modules
	@-git checkout -- package.json

.PHONY: run install build clean distclean
