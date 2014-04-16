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
									'restangular',
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
						$window,
						Restangular,
						$location,
						$timeout
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
					Leanplum.setAppIdForDevelopmentMode(CONFIG.LEANPLUM.appId, CONFIG.LEANPLUM.clientKey);
				} else {
					Leanplum.setAppIdForProductionMode(CONFIG.LEANPLUM.appId, CONFIG.LEANPLUM.clientKey);
				}

				// create parse user to be used for suggestions and voting
				if(Parse.User.current() === null)
					parseUser.createAnonUser();

				if (parseUser.data) {
					// only register if a user is available, otherwise parseUser will handle this, TODO: move to parseUser?
					Leanplum.start(parseUser.data.id);

					// track campaign sources
					var search = $location.search();
					if(search.utm_source) {

						var params = _.extend({
							deviceId: localStorage.getItem('__leanplum_device_id'),
							action: 'setTrafficSourceInfo',
							trafficSource: {
								publisherId: search.utm_source,
								publisherName: search.utm_source,
								publisherSubPublisher: search.utm_source,
								publisherSubSite: search.utm_source,
								publisherSubCampaign: search.utm_campaign,
								publisherSubAdGroup: search.utm_medium,
								publisherSubAd: search.utm_medium
							}
						}, CONFIG.LEANPLUM);
						Restangular.oneUrl('api', 'https://www.leanplum.com/api').get(params);
					}
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