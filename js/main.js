require( [
	'angular',
	'parse',
	'underscore',
	'app',
	'routes',
	'router',
	'vn/ParseServices',
	'vn/_ParseObjects',
	'vn/ParseQueryAngular',
	'cp/textarea-noreturn',
	'cp/nav',
	'cp/vote',
	'cp/submit',
	'dt/Card',
	'dt/Suggestion'
	], 
	function(angular, Parse, _, app) {
		'use strict';
		var $html = angular.element(document.getElementsByTagName('html')[0]);

		$html.addClass('ng-app');
		angular.bootstrap($html, [app.name]);
	}
);