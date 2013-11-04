define([
	'angular',
	'parse',
	'underscore',
	'parseUser',
	'grid'
	], 
	function (angular, Parse, _) {

		// Parse Init
		Parse.initialize(CONFIG.PARSE_APP_ID, CONFIG.PARSE_JS_KEY);

		// Angular Init
		var app = angular.module('app', ['ng', 
											'ui.router',
											'ngGrid',
											'textareaNoreturn',
											'parse.user',
											'ui.bootstrap'
										]);
		console.log('starting app');

		app.config(['$locationProvider', 
			function($locationProvider){
				$locationProvider.html5Mode(false);
				$locationProvider.hashPrefix('!');
			}
		]);

		app.run(['$rootScope', 
					'$state', 
					'$stateParams', 
					'parseUser', 
					function($rootScope,   
								$state,   
								$stateParams,
								parseUser
					) {

						// create parse user to be used for suggestions and voting
						if(Parse.User.current() === null)
							parseUser.createAnonUser();

						function randString() {
							// copy pasta'd from: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
							return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
								var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
								return v.toString(16);
							});
						}

						$rootScope.$state = $state;
						$rootScope.$stateParams = $stateParams;

						// loading animation
						$rootScope.setLoading = function() {
							$rootScope.isViewLoading = true;
						};
						$rootScope.unsetLoading = function() {
							$rootScope.isViewLoading = false;
						};

						$rootScope.isViewLoading = false;

						$rootScope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
							// $rootScope.setBigLoading();
							$rootScope.contentLoaded = false;
						})

						$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
							$rootScope.unsetLoading();
							$rootScope.contentLoaded = true;
						});
					}
		]);

		return app;
});
