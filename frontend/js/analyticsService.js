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
		var trackcmp_email = '';
		var trackcmp = document.createElement("script");
		trackcmp.async = true;
		trackcmp.type = 'text/javascript';
		trackcmp.src = '//trackcmp.net/visit?actid=475050087&e='+encodeURIComponent(trackcmp_email)+'&r='+encodeURIComponent(document.referrer)+'&u='+encodeURIComponent(window.location.href);
		var trackcmp_s = document.getElementsByTagName("script");
		if (trackcmp_s.length) {
			trackcmp_s[0].parentNode.appendChild(trackcmp);
		} else {
			var trackcmp_h = document.getElementsByTagName("head");
			trackcmp_h.length && trackcmp_h[0].appendChild(trackcmp);
		}
	}

	return analyticsService;
});
