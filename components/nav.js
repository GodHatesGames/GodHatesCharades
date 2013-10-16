define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('nav', [function() {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/nav.html',
				replace: true
			}
		}]);
	}
);