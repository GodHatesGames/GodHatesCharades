'use strict';
app.config(function($stateProvider,
			 $urlRouterProvider) {

	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise('/');

	$stateProvider.state('home', {
		url: '/',
		templateUrl: 'views/homeView.html',
		controller: 'homeView'
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
		controller: 'loginView'
	});
	$stateProvider.state('user', {
		url: '/user/:userid',
		templateUrl: 'views/publicProfileView.html',
		controller: 'publicProfileView'
	});
	$stateProvider.state('card', {
		url: '/card/:cardid',
		templateUrl: 'views/cardView.html',
		resolve: {
			bitly: ['$stateParams', '$location', '$q', '$timeout', '$rootScope', function($stateParams, $location, $q, $timeout, $rootScope) {
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
			}]
		},
		controller: 'cardView'
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
	$stateProvider.state('admin.export', {
		url: '/export',
		templateUrl: 'views/exportView.html',
		resolve: {
			allSuggestions: 'getAllSuggestions'
		},
		controller: 'exportView'
	});

	$stateProvider.state('admin.sets', {
		url: '/sets',
		templateUrl: 'views/setsView.html',
		controller: 'setsView'
	});
});