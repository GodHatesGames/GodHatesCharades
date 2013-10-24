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
				link: function($scope, $element) {
					
				},
				controller: function($scope, $element) {
					$scope.parseUser = parseUser;
				}
			}
		}]);
	}
);