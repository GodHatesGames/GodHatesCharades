app.directive('printer', ['cardService', '$compile', function(cardService, $compile) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/printer.html',
		replace: true,
		scope: true,
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;
			var suggestions = [];
			$scope.loading = true;
			$scope.errorMessage;
			
			Parse.Cloud.run(
				'getAllSuggestions',
				{}, 
				{
					success: onSuggestionsLoaded,
					error: onSuggestionsError
				}
			);

			// Private methods

			function onSuggestionsLoaded(newSuggestions) {
				$scope.suggestions = newSuggestions;
				$scope.loading = false;
				$scope.$digest();
			}

			function onSuggestionsError(error) {
				$scope.loading = false;
				$scope.errorMessage = error.message;
				console.log('couldn\'t find any suggestions:', error);
				
				$scope.$digest();
			}

			// Public Methods

			// Watch
		}
	}
}]);