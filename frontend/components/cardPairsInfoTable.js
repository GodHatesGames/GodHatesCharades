app.directive('cardPairsInfoTable', function(Pair) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardPairsInfoTable.html',
		replace: true,
		scope: {
			suggestion: '='
		},
		controller: function($scope, $element, $attrs) {
			$scope.sortPredicates = ['-views',
			                    '-votes',
			                    'skips'];
			$scope.$watch('suggestion', _onSuggestionUpdated);

			function _onSuggestionUpdated() {
				if($scope.suggestion) {
					Pair.getPairsByCard($scope.suggestion)
					.then(_onPairsLoaded);
				}
			}

			function _onPairsLoaded(pairs) {
				$scope.pairs = pairs;
			}
		}
	}
});