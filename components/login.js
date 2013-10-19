define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('login', ['parseUser', function(parseUser) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/login.html',
				replace: true,
				link: function($scope, $element) {
					
				},
				controller: function($scope, $element) {
					$scope.email = '';
					$scope.password = '';

					$scope.login = function() {
						console.log('logging in:', $scope.email, $scope.password);
						parseUser.connect($scope.email, $scope.password);
					}
				}
			}
		}]);
	}
);