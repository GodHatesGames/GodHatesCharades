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
				scope: true,
				link: function($scope, $element) {
					
				},
				controller: function($scope, $element, $state) {
					$scope.email = '';
					$scope.password = '';

					$scope.login = function() {
						console.log('logging in:', $scope.email, $scope.password);
						var promise = parseUser.connect($scope.email, $scope.password);
						promise.then(function() {
							$state.go('profile', {
								userid: user.id
							});
						});
					};
				}
			};
		}]);
	}
);