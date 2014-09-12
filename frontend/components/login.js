app.directive('login', function(parseUser) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/login.html',
		replace: true,
		scope: true,
		controller: function($scope, $element, $state) {
			$scope.email = '';
			$scope.password = '';

			$scope.login = _login;

			function _login() {
				$scope.errorMessage = '';
				console.log('logging in:', $scope.email, $scope.password);
				var promise = parseUser.connect($scope.email, $scope.password);
				promise.then(_onUserLoginSuccess, _onUserLoginError);
			}

			function _onUserLoginSuccess(user) {
				$state.go('user', {
					userid: user.id
				});
			}

			function _onUserLoginError(error) {
				$scope.errorMessage = error.message;
			}
		}
	};
});