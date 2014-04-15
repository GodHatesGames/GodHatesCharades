'use strict';
// Parse Init
Parse.initialize(CONFIG.PARSE_APP_ID, CONFIG.PARSE_JS_KEY);

// Angular Init
var app = angular.module('app', ['ng',
									'ui.router',
									'ui.bootstrap',
									'infinite-scroll',
									'textareaNoreturn',
									'parse.user',
									'ngSanitize',
									'ngCsv'
								]);
console.log('starting app');

app.config(function($locationProvider){
		$locationProvider.html5Mode(false);
		$locationProvider.hashPrefix('!');
	}
);

app.run(function($rootScope,
						$state,
						$stateParams,
						parseUser,
						$window
			) {
				if($window.location.search.length > 0) {
					// grab hash and add if missing
					var hashbang = $window.location.hash;
					if(hashbang.length === 0)
						hashbang = '#!/';
					// rewrite url: localhost/?code=1234#!/ --> localhost/#!/?code=1234
					$window.location = $window.location.origin +
									$window.location.pathname +
									hashbang +
									$window.location.search;
				}

				// setup LeanPlum
				if (CONFIG.DEV) {
					Leanplum.setAppIdForDevelopmentMode('w3SnCbOF375MvSbQgWsBcRTfAA2u0mz645nh3FnsVeY', 'dgfBZhe53x045oU6cYPY4E4rzPSmLDS5WaRuGcPdsjc');
				} else {
					Leanplum.setAppIdForProductionMode('w3SnCbOF375MvSbQgWsBcRTfAA2u0mz645nh3FnsVeY', 'SvChbjZFtSv8UZTJrGoBYVRjwpCyIA9GX4ntmLLUcMY');
				}

				// create parse user to be used for suggestions and voting
				if(Parse.User.current() === null)
					parseUser.createAnonUser();

				if (parseUser.data) {
					// only register if a user is available, otherwise parseUser will handle this, TODO: move to parseUser?
					Leanplum.start(parseUser.data.id);
				}

				// Default away value
				$rootScope.isAway = false;

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
					$rootScope.setLoading();
					if(to.name === 'home')
						$rootScope.isAway = false;
					else
						$rootScope.isAway = true;
				});

				$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
					$rootScope.unsetLoading();
				});

				$rootScope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams, error) {
					$rootScope.unsetLoading();
					console.log('WHOOAAAATTT!!! ' + error);
				});
			}
);