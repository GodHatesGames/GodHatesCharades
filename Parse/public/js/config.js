
var CONFIG = {
	// This app uses parse to access/save player creations
	PARSE_APP_ID: 'awD3vEIkjdxeLpMVrwv0bD8JugIgB3gzbkCMFQkt',
	PARSE_JS_KEY: 'S11gCWChxmk9Wmfua9HmIiIVEKxaIW63VD90oINh'
}

// hey Angular, we're bootstrapping manually!
// window.name = "NG_DEFER_BOOTSTRAP!";

/* Setup RequireJS */
require.config({
	baseUrl: 'js',
	paths: {
		'vn': 'vendor',
		'bw': '../bower',
		'cp': '../components',
		'gm': '../game',
		'angular': '../bower/angular/angular',
		'jquery': '../bower/jquery/jquery',
		'underscore': '../bower/underscore/underscore',
		'router': '../bower/angular-ui-router/angular-ui-router.min',
		'grid': '../bower/ng-grid/ng-grid.min',
		'parse': 'vendor/parse-1.2.12.min',
		'angular-bootstrap': '../bower/angular-bootstrap/ui-bootstrap-tpls',
		'ng-infinite-scroll': '../bower/ngInfiniteScroll/ng-infinite-scroll'
	},
	shim: {
		'angular': {
			exports: 'angular',
			deps: ['jquery']
		},
		'underscore': {
			exports: '_'
		},
		'router': {
			deps: ['angular']
		},
		'parse': {
			exports: 'Parse'
		},
		'vn/phaser': {
			exports: 'Phaser'
		},
		'jquery': {
			exports: '$'
		},
		'grid': {
			deps: ['angular', 'jquery']
		},
		'angular-bootstrap': {
			deps: ['angular']
		},
		'ng-infinite-scroll': {
			deps: ['angular', 'jquery']
		}
	},
	priority: [
		'require-promise',
		'angular',
		'jquery'
	]
});