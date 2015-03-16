'use strict';

// Parse Init
Parse.initialize(CONFIG.PARSE_APP_ID, CONFIG.PARSE_JS_KEY);

// Angular Init
var app = angular.module('app', ['ng',
                                 'ngAnimate',
                                 'ui.router',
                                 'ui.bootstrap',
                                 'ui.select',
                                 'textareaNoreturn',
                                 'ngSanitize',
                                 'restangular',
                                 'ngHtmlCompile',
                                 'ngContent',
                                 'prismic.io',
                                 'slugifier',
                                 'disqusHere',
                                 'angular-data.DSCacheFactory',
                                 'angular-data.DS',
                                 'templateInclude',
                                 'ngCsv',
                                 'youtube-embed',
                                 'infinite-scroll',
                                 'angularStats',
                                 'templates-app',
                                 'hj.uiSrefFastclick',
                                 'analytics.mixpanel'
                                ]);
console.log('starting app!');

app.config(function($locationProvider, PrismicProvider, DSCacheFactoryProvider, $provide, uiSelectConfig, DSProvider, ParseDataSimplifierProvider) {
	// customize Angular-Data
	DSProvider.defaults.deserialize = function (resourceName, data) {
		if(!data) {
			console.log('test');
		}
		var newData = ParseDataSimplifierProvider.simplify(data);
		return newData;
	};

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

	uiSelectConfig.theme = 'bootstrap';

});

app.run(function($rootScope,
                 $state,
                 $stateParams,
                 $location,
                 analytics
	) {
		console.log('preping router')
		// Default away value
		$rootScope.firstLoad = true;
		$rootScope.isAway = false;

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
			console.log('page loaded:', $rootScope.currentUrl);

			$rootScope.unsetLoading();
			$rootScope.currentUrl = $location.absUrl();
			
			if($rootScope.firstLoad) {
				$rootScope.firstLoad = false;
				analytics.mpFirstLoad();
			}

			analytics.mpEvent('View');
		});

		$rootScope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams, error) {
			$rootScope.unsetLoading();
			console.log('Error transitioning to state', to.name, error.message);
			console.log(error.stack);
			$state.go('error', {
				message: error.message
			})
		});
	}
);

app.run(function($rootScope,
                 $state,
                 $stateParams,
                 $location,
                 addthisService,
                 SetItem,
                 Set,
                 User,
                 Suggestion,
                 analytics) {
	console.log('everything is loaded');
	}
);