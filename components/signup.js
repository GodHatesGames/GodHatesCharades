define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('signup', ['parseUser', function(parseUser) {
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

					$scope.signup = function() {
						var promise = parseUser.signup($scope.email, $scope.password, $scope.email);
						promise.then(onUserCreated);
					}

					function onUserCreated() {
						parseUser.data.set('name', $scope.name);
						var promise = parseUser.save();
						promise.then(onSignedUp);
					}

					function onSignedUp() {
						console.log('signup success');
						$scope.$digest();
					}
				}
			}
		}]);
	}
);