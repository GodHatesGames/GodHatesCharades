'use strict';

// Parse Init
Parse.initialize(CONFIG.PARSE_APP_ID, CONFIG.PARSE_JS_KEY);

// Angular Init
var app = angular.module('app', ['ng',
                                 'ngAnimate',
                                 'ui.router',
                                 'ui.bootstrap',
                                 'textareaNoreturn',
                                 'parse.user',
                                 'ngSanitize',
                                 'restangular',
                                 'ngHtmlCompile',
                                 'ngContent',
                                 'prismic.io',
                                 'slugifier',
                                 'disqusHere',
                                 'angular-data.DSCacheFactory',
                                 'templateInclude',
                                 'ngCsv'
                                ]);
console.log('starting app');

app.config(function($locationProvider, PrismicProvider, DSCacheFactoryProvider, $provide) {
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');

	if (CONFIG.PRISMIC) {
		PrismicProvider.setApiEndpoint(CONFIG.PRISMIC.API_ENDPOINT);
		if (CONFIG.PRISMIC.ACCESS_TOKEN)
			PrismicProvider.setAccessToken(CONFIG.PRISMIC.ACCESS_TOKEN);
		if(CONFIG.PRISMIC.CLIENT_ID)
			PrismicProvider.setClientId(CONFIG.PRISMIC.CLIENT_ID);
		if(CONFIG.PRISMIC.CLIENT_SECRET)
			PrismicProvider.setClientSecret(CONFIG.PRISMIC.CLIENT_SECRET);
	}
	PrismicProvider.setLinkResolver(function(ctx, doc) {
		return 'detail.html?id=' + doc.id + '&slug=' + doc.slug + ctx.maybeRefParam;
	});

	DSCacheFactoryProvider.setCacheDefaults({
		storageMode: 'localStorage',
		capacity: 200
	});

});

app.run(function($rootScope,
                 $state,
                 $stateParams,
                 parseUser,
                 $window,
                 $location,
                 $timeout,
                 addthisService
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
			$rootScope.currentUrl = $location.absUrl();
		});

		$rootScope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams, error) {
			$rootScope.unsetLoading();
			console.log('Error transitioning to state', to.controller, error.message);
			console.log(error.stack);
		});
	}
);