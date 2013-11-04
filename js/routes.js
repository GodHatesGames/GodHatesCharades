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
			templateUrl: "views/homeView.html",
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
		$stateProvider.state('user', {
			url: "/user/:userid",
			templateUrl: "views/publicProfileView.html",
			controller: function ($scope, $stateParams) {
				$scope.userid = $stateParams.userid;
			}
		});
		$stateProvider.state('card', {
			url: "/card/:cardid",
			templateUrl: "views/cardView.html",
			controller: function ($scope, $stateParams) {
				$scope.cardid = $stateParams.cardid;
			}
		});
		$stateProvider.state('suggestions', {
			url: "/suggestions",
			templateUrl: "views/suggestionsView.html"
		});
		$stateProvider.state('moderation', {
			url: "/moderation",
			templateUrl: "views/moderationView.html"
		});
		$stateProvider.state('top', {
			url: "/top",
			templateUrl: "views/topView.html"
		});
	}]);

});
