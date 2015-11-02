'use strict';
app.directive('suggestionSelector', function(Suggestion, $filter, $state, $modal) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/admin.suggestionSelector.html',
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
			var DEFAULT_LIMIT = 10;
			var LOAD_LIMIT = 1;
			$scope.extras = _.range(DEFAULT_LIMIT);
			$scope.list = {
				search: null,
				limit: DEFAULT_LIMIT,
				searchProps: ['text'],
				sortDirection: null,
				sortOverrideKeys: null
			}
			$scope.$watch('search', _onSearchUpdated);
			$scope.$watch('list.search', _onSelectorUpdated);

			// Public methods
			$scope.checkEscape = _checkEscape;
			$scope.loadSuggestions = _loadSuggestions;
			$scope.selectSuggestion = _selectSuggestion;

			// Private methods
			function _loadSuggestions() {
				$scope.list.limit += DEFAULT_LIMIT;
			}

			function _selectSuggestion(suggestion) {
				console.log('selectSuggestion');
				$scope.$emit('suggestionAdded', suggestion);
			}
			
			function _onSelectorUpdated(newValue) {
				if($scope.list.limit > DEFAULT_LIMIT) {
					$scope.list.limit = DEFAULT_LIMIT;
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