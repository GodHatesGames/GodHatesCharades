app.directive('signupSection', function() {
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
				mixpanel.track('Newsletter: Signup', {
					location: fromLabel
				});
				_pa.track('signup_newletter');
			};
		}
	}
});