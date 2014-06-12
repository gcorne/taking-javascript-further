require( 'bespoke' );
require( 'bespoke-keys' );
require( 'bespoke-touch' );
require( 'bespoke-bullets' );
require( 'bespoke-run' );
require( 'bespoke-hash' );
require( 'bespoke-progress' );
require( 'bespoke-state' );
require( 'bespoke-forms' );
require( 'prismjs' );
window.jQuery = require( 'jquery' );
window._ = require( 'underscore' );
window.Backbone = require( 'backbone' );

function start() {
	deck = window.bespoke.from('article', {
		keys: true,
		touch: true,
		run: true,
		bullets: 'li, .bullet',
		hash: true,
		progress: true,
		state: true,
		forms: true
	});

}

start();
