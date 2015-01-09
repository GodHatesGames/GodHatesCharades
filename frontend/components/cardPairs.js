app.directive('cardPairs', function(Pair) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardPairs.html',
		replace: true,
		scope: {
			suggestion: '=?',
			pairs: '=?',
			sortPredicates: '=?'
		},
		controller: function($scope, $element, $attrs) {
			var defaultPredicates = ['-getViews()',
			                         '-getVotes()',
			                         'getSkips()'];
			if(!$scope.sortPredicates)
				$scope.sortPredicates = defaultPredicates;

			//if pairs is defined then there is no need to use suggestion
			if(!$scope.pairs)
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