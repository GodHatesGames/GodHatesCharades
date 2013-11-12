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

					if(parseUser.data && 
						!parseUser.isAnon() && 
						$scope.userid === parseUser.data.id) {
						$scope.user = parseUser.data;
					} else {
						// $scope.loading = true;
						var query = new Parse.Query(Parse.User);
						query.get($scope.userid, {
							success: onUserFound,
							error: onUserError
						});
					}

					function onUserFound(user) {
						$scope.user = user;
						$scope.$digest();
					}

					function onUserError(user, error) {
						$scope.error = true;
						$scope.$digest();
					}
				}
			}
		}]);
	}
);