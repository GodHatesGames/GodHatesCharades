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
		deferred.resolve();
	}

	function _waitForLoad(callback) {
		return deferred.promise;
	}

	return addthisService;
});