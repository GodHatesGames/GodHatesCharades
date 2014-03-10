'use strict';
app.directive('nav', function(parseUser, $uiViewScroll) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/nav.html',
		replace: true,
		scope: true,
		controller: function($scope, $element) {
			$scope.parseUser = parseUser;

			$scope.jumpToElement = function(id) {
				// var selector = '#' + id;
				var element = angular.element(document.getElementById(id));
				$uiViewScroll(element);
			};
		}
	};
});