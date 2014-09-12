app.controller('resetPasswordView', function(parseUser, $scope) {
	$scope.email = '';

	$scope.reset = _reset;

	function _reset() {
		$scope.message = '';
		parseUser.resetPassword($scope.email)
		.then(_onResetSent, _onResetFail);
	};

	function _onResetSent() {
		$scope.message = 'Awesome, check your email for the reset link!';
	}

	function _onResetFail(error) {
		$scope.message = 'Oops something went wrong, our server-bot says: ' + error.message;
	}
});