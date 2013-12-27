define([
	'angular',
	'app'
	],
	function(angular, app) {
	'use strict';

	return app.config([
		'$stateProvider',
		'$urlRouterProvider',
		function($stateProvider,
				 $urlRouterProvider) {

		// For any unmatched url, redirect to /state1
		$urlRouterProvider.otherwise('/');

		$stateProvider.state('home', {
			url: '/',
			templateUrl: 'views/homeView.html',
			controller: function($scope, campaignService) {
				$scope.kickstarter = campaignService.campaignsById['ks2013'];
			}
		});
		$stateProvider.state('submit', {
			url: '/submit',
			templateUrl: 'views/submitView.html'
		});
		$stateProvider.state('vote', {
			url: '/vote',
			templateUrl: 'views/voteView.html'
		});
		$stateProvider.state('login', {
			url: '/login',
			templateUrl: 'views/loginView.html',
			resolve: {
				parseUser: 'parseUser'
			},
			controller: function(parseUser, $scope) {
				$scope.parseUser = parseUser;
			}
		});
		$stateProvider.state('user', {
			url: '/user/:userid',
			templateUrl: 'views/publicProfileView.html',
			controller: function ($scope, $stateParams) {
				$scope.userid = $stateParams.userid;
			}
		});
		$stateProvider.state('card', {
			url: '/card/:cardid',
			templateUrl: 'views/cardView.html',
			resolve: {
				bitly: function($stateParams, $location, $q, $timeout, $rootScope) {
					var voteId = $stateParams.voteid;
					var longUrl = 'http://godhatescharades.com/#!/card/' + $stateParams.cardid;
					var deferred = $q.defer();

					var params = {
						access_token: '9635aa9298c0745e2afbed732ebab820ad0b699d',
						longUrl: longUrl
					};
					
					$.ajax({
						type: 'GET',
						url: 'https://api-ssl.bitly.com/v3/shorten',
						async: false,
						contentType: 'application/json',
						dataType: 'jsonp',
						data: params
					}).then(function(data) {
						var url = data.data.url;
						deferred.resolve(url);
						$rootScope.$digest();
						return data;
					}, function(data) {
						console.log('error getting bitly link');
						deferred.resolve(longUrl);
						$rootScope.$digest();
					});

					return deferred.promise;
				}
			},
			controller: function (bitly, $scope, $stateParams, $location, $window) {
				$scope.cardid = $stateParams.cardid;
				$scope.bitly = bitly;

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
				/* END DISQUS */

				/* ADD THIS */
				$window.addthis_share = {
					url: bitly,
					title: 'Help me support my charity:'
				};

				jQuery('body').append($('<script>var addthis_config = {"data_track_addressbar":true};</script><script src="http://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-527852867cd289ce"></script>'));
				/* END ADD THIS */
			}
		});
		$stateProvider.state('suggestions', {
			url: '/suggestions',
			templateUrl: 'views/suggestionsView.html'
		});
		$stateProvider.state('rules', {
			url: '/rules',
			templateUrl: 'views/rulesView.html'
		});
		$stateProvider.state('top', {
			url: '/top',
			templateUrl: 'views/topView.html'
		});
		
		// Admin
		$stateProvider.state('admin', {
			url: '/admin',
			abstract: true,
			template: '<ui-view></ui-view>'
		});
		$stateProvider.state('admin.moderation', {
			url: '/moderation',
			templateUrl: 'views/moderationView.html'
		});
		$stateProvider.state('admin.print', {
			url: '/print',
			templateUrl: 'views/printView.html'
		});
	}]);

});
