app.controller('voteView', function($scope, leanplum) {
	$scope.leanplum = leanplum;

	$scope.onEmailSubmitted = function(fromLabel) {
		$scope.emailSubmitted = true;
		Leanplum.track('Signed up for email updates');
		ga('send', 'event', 'signup', 'newsletter', fromLabel);
		_pa.track('signup_newletter');
	};
});