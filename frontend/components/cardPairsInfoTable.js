app.directive('cardPairsInfoTable', function(Pair) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardPairsInfoTable.html',
		replace: true,
		scope: {
			suggestion: '=',
			showPairsOnLoad: '='
		},
		controller: function($scope, $element, $attrs) {
			$scope.sortPredicates = ['-views',
			                         '-votes',
			                         'skips'];
			$scope.showPairs = $scope.showPairsOnLoad ? true : false;
			$scope.$watch('suggestion', _loadPairs);
			$scope.showPairsAndLoad = _showPairsAndLoad;
			$scope.displayMorePairs = _displayMorePairs;
			var DEFAULT_LIMIT = 10;
			var LOAD_LIMIT = 1;
			$scope.list = {
				search: null,
				limit: DEFAULT_LIMIT,
				searchProps: ['text']
			}
			$scope.$watch('list.search', _onSelectorUpdated);

			function _onSelectorUpdated(newValue) {
				if($scope.list.limit > DEFAULT_LIMIT) {
					$scope.list.limit = DEFAULT_LIMIT;
				}
			}

			function _displayMorePairs(limitOverride) {
				if(limitOverride) {
					$scope.list.limit += limitOverride;
				} else {
					$scope.list.limit += LOAD_LIMIT;
				}
			}

			function _loadPairs() {
				if($scope.suggestion && $scope.showPairs) {
					$scope.loading = true;
					Pair.getPairsByCard($scope.suggestion)
					.then(_onPairsLoaded);
				}
			}

			function _onPairsLoaded(pairs) {
				$scope.loading = false;
				$scope.pairs = pairs;
			}

			function _showPairsAndLoad() {
				$scope.showPairs = true;
				_loadPairs();
			}
		}
	}
});