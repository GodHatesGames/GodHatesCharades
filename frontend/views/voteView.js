app.controller('voteView', function($scope, leanplum, $window) {
	$window.scrollTo(0, 0);
	$scope.leanplum = leanplum;

	$scope.onEmailSubmitted = function(fromLabel) {
		$scope.emailSubmitted = true;
		Leanplum.track('Signed up for email updates');
		ga('send', 'event', 'signup', 'newsletter', fromLabel);
		_pa.track('signup_newletter');
	};
});