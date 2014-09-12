app.directive('signup', function(parseUser, $state) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/signup.html',
		replace: true,
		scope: true,
		link: function($scope, $element) {

		},
		controller: function($scope, $element) {
			$scope.name = '';
			$scope.email = '';
			$scope.password = '';

			$scope.signup = _signup;

			function _signup() {
				$scope.errorMessage = '';
				var promise = parseUser.signupAnonUser($scope.email, $scope.password, $scope.email, $scope.name);
				promise.then(_onSignedUp, _onSignupError);
			}

			function _onSignedUp(user) {
				console.log('signup success');
				$state.go('user', {userid: user.id});
			}

			function _onSignupError(error) {
				$scope.errorMessage = error.message;
				$scope.$digest();
			}
		}
	};
});