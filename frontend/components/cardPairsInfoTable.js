app.directive('cardPairsInfoTable', function(pairService, cardDetailsModal) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardPairsInfoTable.html',
		replace: true,
		scope: {
			suggestion: '='
		},
		controller: function($scope, $element, $attrs) {
			$scope.cardDetailsModal = cardDetailsModal;
			$scope.sortPredicates = ['-getViews()',
			                    '-getVotes()',
			                    'getSkips()'];
			$scope.$watch('suggestion', _onSuggestionUpdated);

			function _onSuggestionUpdated() {
				if($scope.suggestion) {
					pairService.getPairsByCard($scope.suggestion)
					.then(_onPairsLoaded);
				}
			}

			function _onPairsLoaded(pairs) {
				$scope.pairs = pairs;
			}
		}
	}
});