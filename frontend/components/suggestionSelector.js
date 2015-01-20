'use strict';
app.directive('suggestionSelector', function(Suggestion, $filter, $state, $modal) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/suggestionSelector.html',
		replace: true,
		scope: {
			suggestions: '=',
			search: '='
		},
		link: function($scope, $element) {
			// $scope.$watch('pairIndex', $scope.onPairIndexChanged);
		},
		controller: function($scope, $element) {
			// public vars
			$scope.tab = 'best';
			$scope.$watch('search', _onSearchUpdated);
			var LIST_LIMIT = 10;
			$scope.list = {
				search: null,
				limit: LIST_LIMIT,
				searchProps: ['text']
			}
			$scope.$watch('list.search', _onSelectorUpdated);

			// Public methods
			$scope.checkEscape = _checkEscape;
			$scope.loadSuggestions = _loadSuggestions;
			$scope.selectSuggestion = _selectSuggestion;

			// Private methods
			function _loadSuggestions() {
				$scope.list.limit += LIST_LIMIT;
			}

			function _selectSuggestion(suggestion) {
				console.log('selectSuggestion');
				$scope.$emit('suggestionAdded', suggestion);
			}
			
			function _onSelectorUpdated(newValue) {
				if($scope.list.limit > LIST_LIMIT) {
					$scope.list.limit = LIST_LIMIT;
				}
			}

			function _onSearchUpdated(newValue) {
				$scope.searchSelector = newValue;
			}

			function _checkEscape(event) {
				if(event.keyCode === 27)
					angular.element(event.target).scope().editing = false;
			}

		}
	};
});