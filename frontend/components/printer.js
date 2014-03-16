'use strict';
app.directive('printer', function(cardService, $compile, $window) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/printer.html',
		replace: true,
		scope: true,
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;

			// Private methods
			function print() {
				$window.print();
			}

			// Public Methods
			$scope.printColor = function() {
				$element.removeClass('colorless');
				print();
			};

			$scope.printBlack = function() {
				$element.addClass('colorless');
				print();
			};

			// Watch
		}
	};
});