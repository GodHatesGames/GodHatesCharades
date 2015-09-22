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
				analytics.trackEvent('Newsletter Signup', {
					'Location': fromLabel
				});
				if(this._pa)
					_pa.track('signup_newletter');
			};
		}
	}
});