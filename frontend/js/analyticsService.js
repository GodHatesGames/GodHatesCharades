app.service('analytics', function($location, $state, $http) {
	var analyticsService = {
		getPageTitle: _getPageTitle,
		getPageUrl: _getPageUrl,
		trackEvent: _trackEvent,
		trackPage: _trackPage,
		trackFirstLoad: _trackFirstLoad
	};

	function _getPageTitle() {
		if($state.current.title) {
			return $state.current.title;
		} else if($state.current.parent) {
			return $state.current.parent.title;
		} else {
			return 'God Hates Charades';
		}
	}

	function _getPageUrl() {
		return $location.host() + $location.path()
	}

	function _trackEvent(eventTitle, eventOptions) {
		var defaultOptions = {
			'Page Title': _getPageTitle(),
			'Page Url': _getPageUrl()
		};
		var options = _.extend(defaultOptions, eventOptions);
		// add tracking here
		// ActiveCampaign

	}

	function _trackFirstLoad() {
		// add tracking here
	}

	function _trackPage() {
		_acTrackPage();
	}

	function _acTrackPage() {
		$http.get('//trackcmp.net/visit', {
			params: {
				actid: 475050087,
				e: '',
				r: document.referrer,
				u: _getPageUrl()
			}
		})
	}

	return analyticsService;
});
