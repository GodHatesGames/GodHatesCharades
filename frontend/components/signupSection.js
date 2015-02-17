app.directive('signupSection', function(analytics) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/signupSection.html',
		replace: true,
		scope: {
			location: '@location'
		},
		controller: function($scope, $element) {
			$scope.onEmailSubmitted = function(fromLabel) {
				$scope.emailSubmitted = true;
				ga('send', 'event', 'signup', 'newsletter', fromLabel);
				mixpanel.track('Newsletter Signup', {
					'Location': fromLabel,
					'Page Title': analytics.getPageTitle(),
					'Page Url': analytics.getPageUrl()
				});
				if(this._pa)
					_pa.track('signup_newletter');
			};
		}
	}
});