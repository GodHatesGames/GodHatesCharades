'use strict';
app.service('addthisService', function($rootScope, $q) {
	// console.log('instantiate addthisService');
	var addthisService = {
		waitForLoad: _waitForLoad
	};

	var deferred = $q.defer();

	var windowWatcher = $rootScope.$watch(_checkLoad, _onLoaded);

	function _checkLoad() {
		if(typeof addthis === 'undefined') {
			return false;
		} else {
			return true;
		}
	}

	function _onLoaded(loaded) {
		if(loaded) {
			windowWatcher(); //destroy the window watcher
			addthis.addEventListener('addthis.ready', _onAddThisReady);
		}
	}

	function _onAddThisReady(event) {
		console.log('add this ready');

		addthis.addEventListener('addthis.menu.share', _onShare);
		deferred.resolve();
	}

	function _onShare(response) {
		console.log('shared', response);
		var service = response.data.service;
		ga('send', 'event', 'social_share', 'addthis', service);
		mixpanel.track('Social: AddThis', {
			service: service
		});
	}

	function _waitForLoad(callback) {
		return deferred.promise;
	}

	return addthisService;
});