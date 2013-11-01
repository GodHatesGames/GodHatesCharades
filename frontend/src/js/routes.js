define([
	'angular',
	'app'
	],
	function(angular, app) {
	'use strict';

	return app.config([
		'$stateProvider',
		'$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {

		// For any unmatched url, redirect to /state1
		$urlRouterProvider.otherwise("/");

		$stateProvider.state('home', {
			url: "/",
			templateUrl: "views/home.html",
			onEnter: function($rootScope) {
				$rootScope.isHome = true;
			},
			onExit: function($rootScope) {
				$rootScope.isHome = false;
			}
		});
		$stateProvider.state('submit', {
			url: "/submit",
			templateUrl: "views/submitView.html"
		});
		$stateProvider.state('vote', {
			url: "/vote",
			templateUrl: "views/voteView.html"
		});
		$stateProvider.state('login', {
			url: "/login",
			templateUrl: "views/loginView.html"
		});
		$stateProvider.state('profile', {
			url: "/profile",
			templateUrl: "views/profileView.html",
			resolve: {
				parseUser: "parseUser"
			}
		});
		$stateProvider.state('suggestions', {
			url: "/suggestions",
			templateUrl: "views/suggestionsView.html"
		});
		$stateProvider.state('top', {
			url: "/top",
			templateUrl: "views/topView.html"
		});
	}]);

});
