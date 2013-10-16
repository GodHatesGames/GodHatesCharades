define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('vote', [function() {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/vote.html',
				replace: true
			}
		}]);
	}
);