app.directive('login', function(User) {
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
				User.login($scope.email, $scope.password)
				.then(_onUserLoginSuccess, _onUserLoginError);
			}

			function _onUserLoginSuccess() {
				if(User.current.admin) {
					$state.go('admin.upload');
				} else {
					$state.go('user', {
						userid: User.current.id
					});
				}
			}

			function _onUserLoginError(error) {
				$scope.errorMessage = error.message;
			}
		}
	};
});