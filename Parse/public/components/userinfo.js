define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('userinfo', ['parseUser', function(parseUser) {
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
					if($scope.userid === undefined)
						console.log('userid not provided');

					var promise = parseUser.getUserById($scope.userid);
					promise.then(onUserFound, onUserError);

					function onUserFound(user) {
						$scope.user = user;
					}

					function onUserError(error) {
						$scope.error = true;
					}
				}
			}
		}]);
	}
);