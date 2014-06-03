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
				parseUser.getProfileById($scope.userid)
				.then(onProfileFound, onProfileError);
			}

			function onProfileFound(profile) {
				$scope.user = profile.owner;
			}

			function onProfileError(profile) {
				$scope.error = true;
			}
		}
	};
});