app.directive('printer', function(cardService, $compile) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/printer.html',
		replace: true,
		scope: true,
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;

			// Private methods

			// Public Methods

			// Watch
		}
	}
});