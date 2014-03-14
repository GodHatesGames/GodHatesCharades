'use strict';
app.directive('nav', function(parseUser, $uiViewScroll, $state, $timeout) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/nav.html',
		replace: true,
		scope: true,
		controller: function($scope, $element) {
			$scope.parseUser = parseUser;

			$scope.jumpToElementInView = function(id, location) {
				// var selector = '#' + id;

				// attempt to switch pages if needed, then jump
				$state.go(location)
				.then(function() {
					jumpIfFound(id);
				});

				function jumpIfFound(id) {
					var element = angular.element(document.getElementById(id));
					if (element.length > 0) {
						$uiViewScroll(element);
						element.addClass('animated rubberBand');
						$timeout(function() {
							element.removeClass('animated rubberBand');
						}, 1000);
					} else {
						return false;
					}
				}
			};
		}
	};
});