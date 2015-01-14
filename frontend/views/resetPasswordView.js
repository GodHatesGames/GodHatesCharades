app.controller('resetPasswordView', function(User, $scope) {
	$scope.email = '';

	$scope.reset = _reset;

	function _reset() {
		$scope.errorMessage = '';
		User.resetPassword($scope.email)
		.then(_onResetSent, _onResetFail);
	};

	function _onResetSent() {
		$scope.successMessage = 'Awesome, check your email for the reset link!';
	}

	function _onResetFail(error) {
		$scope.errorMessage = error.message;
	}
});