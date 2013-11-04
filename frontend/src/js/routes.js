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
			controller: function ($scope, $stateParams, $location) {
				$scope.cardid = $stateParams.cardid;

				// DISQUS
				/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
				var disqus_shortname = 'godhatescharades'; // required: replace example with your forum shortname
				var disqus_url = $location.absUrl();
				var disqus_identifier = $stateParams.cardid;
				// console.log('url:', disqus_url);

				/* * * DON'T EDIT BELOW THIS LINE * * */
				(function() {
					var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
					dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
					(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
				})();
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
