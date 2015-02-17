app.service('analytics', function($location, $state) {
	var analyticsService = {
		getPageTitle: _getPageTitle,
		getPageUrl: _getPageUrl
	};

	function _getPageTitle() {
		return ($state.current.title || $state.current.parent.title);
	}

	function _getPageUrl() {
		return $location.host() + $location.path()
	}

	return analyticsService;
});