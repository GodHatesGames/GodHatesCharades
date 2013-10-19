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
				link: function($scope, $element) {

				},
				controller: function($scope, $element) {

				}
			}
		}]);
	}
);