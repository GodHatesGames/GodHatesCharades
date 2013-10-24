define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('nav', ['parseUser', function(parseUser) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/nav.html',
				replace: true,
				scope: true,
				controller: function($scope, $element) {
					$scope.isAdmin = parseUser.isAdmin;
				}
			}
		}]);
	}
);