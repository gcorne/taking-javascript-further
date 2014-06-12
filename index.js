/**
 * Module dependencies.
 */

var boot = require('boot');
var http = require('http');
var pkg = require('./package.json');

// Start App
var start = Date.now();
var port = process.env.PORT || 3000;
var app = boot();

console.log('%s booted in %dms - port: %s', pkg.name, (Date.now()) - start, port);
var server = http.createServer(app);
server.listen(port);
