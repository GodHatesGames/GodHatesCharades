require( [
	'angular',
	'parse',
	'underscore',
	'app',
	'routes',
	'router',
	'cardService',
	'angular-bootstrap',
	'ng-infinite-scroll',
	'cp/textarea-noreturn',
	'cp/card',
	'cp/cardInfo',
	'cp/nav',
	'cp/userinfo',
	'cp/login',
	'cp/signup',
	'cp/vote',
	'cp/suggestions',
	'cp/suggestionRow',
	'cp/moderator',
	'cp/topSubmissions',
	'cp/userSubmissions',
	'cp/submit'
	], 
	function(angular, Parse, _, app) {
		'use strict';
		var $html = angular.element(document.getElementsByTagName('html')[0]);

		$html.addClass('ng-app');
		angular.bootstrap($html, [app.name]);
	}
);