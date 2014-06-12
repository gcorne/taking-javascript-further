
/**
 * Module dependencies.
 */

var path = require('path');
var build = require('build');
var morgan = require('morgan');
var express = require('express');
var pathToRegexp = require('path-to-regexp');
var debug = require('debug')('skeleton:boot');

/**
 * Module exports.
 */

module.exports = setup;

/**
 * Returns the server HTTP request handler "app".
 *
 * The skeleton Express.js setup includes a `build` middleware that
 * runs `make build` upon every HTTP request.
 *
 * @return {Function} returns an HTTP server request handler
 * @public
 */

function setup () {

	var app = express();

	// for nginx
	app.enable('trust proxy');

	// template engine
	app.set('views', __dirname);
	app.set('view engine', 'jade');

	// setup logger
	app.use(morgan({ format: 'dev' }));

	// only do `make build` upon every request in "development"
	app.use(build());

	// attach the static file server to serve the `public` dir
	var staticProvider = express.static(path.resolve(__dirname, '..', '..', 'public'));
	app.use(staticProvider);

	// setup the routes that are defined in `client/boot/index.js` to serve
	// the main `index.html` file, since that's where the page.js logic will load
	app.use(serveRoot('/:site/:post', staticProvider));

	return app;
}

/**
 * A small middleware that rewrites the `req.url` property to "/index.html"
 * so that the staticProvider() middleware will serve the app entry point HTML.
 *
 * Mount this middleware *after* the regular static provider so that files in
 * the static directory take precedence over these routes.
 *
 * @param {String|RegExp} pattern
 * @public
 */

function serveRoot (pattern, staticProvider) {
	var keys = [];
	var r = pathToRegexp(pattern, keys);
	return function (req, res, next) {
	if (r.test(req.path)) {
		debug('got path %o, serving index.html file', req.path);
		req.url = '/index.html';
		// defer to the `static()` middleware at this point
		staticProvider(req, res, next);
		} else {
			next();
		}
	};
}
