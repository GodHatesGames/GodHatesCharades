app.service('analytics', function($location, $state) {
	var analyticsService = {
		getPageTitle: _getPageTitle,
		getPageUrl: _getPageUrl
	};

	function _getPageTitle() {
		if($state.current.title) {
			return $state.current.title;
		} else if($state.current.parent) {
			return $state.current.parent.title;
		}
	}

	function _getPageUrl() {
		return $location.host() + $location.path()
	}

	return analyticsService;
});