'use strict';
// Parse Init
Parse.initialize(CONFIG.PARSE_APP_ID, CONFIG.PARSE_JS_KEY);

// Angular Init
var app = angular.module('app', ['ng',
									'ui.router',
									'ui.bootstrap',
									'textareaNoreturn',
									'parse.user',
									'ngSanitize',
									'restangular',
									'ngCsv'
								]);
console.log('starting app');

app.config(function($locationProvider){
		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
	}
);

app.run(function($rootScope,
                 $state,
                 $stateParams,
                 parseUser,
                 $window,
                 $location,
                 $timeout
	) {
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
			console.log('Error transitioning to state', to.controller, error.message);
			console.log(error.stack);
		});
	}
);