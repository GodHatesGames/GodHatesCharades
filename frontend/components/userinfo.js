app.directive('userinfo', function(parseUser) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/userinfo.html',
		replace: true,
		scope: {
			userid: '=userid'
		},
		controller: function($scope, $element) {
			$scope.error = false;
			// $scope.loading = false;

			if ($scope.userid) {
				parseUser.getUserById($scope.userid)
				.then(onUserFound, onUserError);
			}

			function onUserFound(user) {
				$scope.user = user;
			}

			function onUserError(error) {
				$scope.error = true;
			}
		}
	};
});