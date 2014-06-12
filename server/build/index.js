
/**
 * Module dependencies.
 */

var os = require('os');
var path = require('path');
var spawn = require('child_process').spawn;
var debug = require('debug')('skeleton:build');

/**
 * Module exports.
 */

module.exports = setup;

/**
 * Returns a "build middleware", which runs `make build` upon each HTTP
 * request. Meant for use in "development" env.
 *
 * @return {Function} build middleware function
 * @public
 */

function setup() {
  var build = null;
  var cores = os.cpus().length;
  var rootdir = path.resolve(__dirname, '..', '..');

  function spawnMake() {
    debug('spawning %o', 'make build --jobs ' + cores);
    build = spawn('make', ['build', '--jobs', cores], {
      cwd: rootdir,
      stdio: [ 'ignore', 'pipe', process.stderr ]
    });
    build.once('exit', onexit);
    build.stdout.setEncoding('utf8');
    build.stdout.on('data', onstdout);
  }

  function onstdout(d) {
    debug('stdout %o', d.trim());
  }

  function onexit() {
    build = null;
  }

  return function (req, res, next) {
    if (!build) spawnMake();
    build.once('exit', function(code) {
      if (0 === code) {
        // `make build` success
        next();
      } else {
        // `make build` failed
        next(new Error('`make build` failed (exit code: ' + code + ')'));
      }
    });
  };
}
