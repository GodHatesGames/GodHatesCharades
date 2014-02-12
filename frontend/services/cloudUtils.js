'use strict';
app.service('cloudUtils', function() {
	var cloudUtils = {
		getDefaultParams: getDefaultParams
	};

	var defaultParams = {
		appVersion: CONFIG.APP_VERSION,
		appPlatform: CONFIG.APP_PLATFORM
	};

	function getDefaultParams(paramsToAdd) {
		return angular.extend({}, defaultParams, paramsToAdd);
	}

	return cloudUtils;
});
