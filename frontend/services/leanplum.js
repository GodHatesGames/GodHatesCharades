'use strict';
app.service('leanplum', function($q, $location, Restangular, $rootScope) {
	var leanplumVars = {};
	var leanplumMethods = {
		startLeanPlum: _startLeanPlum,
		vars: leanplumVars
	};

	// private methods
	function _startLeanPlum(userId) {
		console.log('start LeanPlum');
		Leanplum.start(userId, _onStarted);

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

	function _onStarted() {
		console.log('leanplum started');
		leanplumVars = _.extend(leanplumVars, Leanplum.getVariables());
		$rootScope.$digest();
	}

	// setup LeanPlum
	if (CONFIG.DEV) {
		Leanplum.setAppIdForDevelopmentMode(CONFIG.LEANPLUM.appId, CONFIG.LEANPLUM.clientKey);
	} else {
		Leanplum.setAppIdForProductionMode(CONFIG.LEANPLUM.appId, CONFIG.LEANPLUM.clientKey);
	}

	Leanplum.setVariables({
		homeHeadline: 'This Party Game makes your Friends funny.',
		homeSubtitle: 'God Hates Charades is full of pop culture and melt-your-face humor.',
		homeDownloadCopy: 'Download Print N\' Play PDF',
		homeLayout: 'default',
		homeVideo: ''
	});

	return leanplumMethods;
});