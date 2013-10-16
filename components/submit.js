define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('submit', [function() {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/submit.html',
				replace: true
			}
		}]);
	}
);