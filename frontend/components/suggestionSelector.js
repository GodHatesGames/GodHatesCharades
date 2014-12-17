'use strict';
app.directive('suggestionSelector', function(getAllSuggestions, cardService, $filter, $state, $modal) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/suggestionSelector.html',
		replace: true,
		scope: {
			search: '=search'
		},
		link: function($scope, $element) {
			// $scope.$watch('pairIndex', $scope.onPairIndexChanged);
		},
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;
			$scope.tab = 'best';
			$scope.loading = true;
			$scope.$watch('search', _onSearchUpdated);

			// Public methods
			$scope.checkEscape = _checkEscape;

			getAllSuggestions.then(_onSuggestionsRetrieved);

			$scope.selectSuggestion = function(suggestion) {
				console.log('selectSuggestion');
				$scope.$emit('suggestionAdded', suggestion);
			};

			$scope.editSuggestion = _editSuggestion;

			// Private methods

			function _onSuggestionsRetrieved(suggestions) {
				$scope.loading = false;
				$scope.suggestions = suggestions.data;
			}

			function _onSearchUpdated(newValue) {
				$scope.searchSelector = newValue;
			}

			function _checkEscape(event) {
				if(event.keyCode === 27)
					angular.element(event.target).scope().editing = false;
			}

			function _editSuggestion(isolatedScope, suggestion) {
				var modalScope = $scope.$new(true);
				modalScope.suggestion = suggestion;
				modalScope.onSuccess = _onEditSuccess;
				modalScope.onError = _onEditError;

				var modalInstance = $modal.open({
					templateUrl: 'components/cardForm.modal.html',
					scope: modalScope,
					size: 'sm'
				})

				function _onEditSuccess() {
					console.log('modal success');
					modalInstance.dismiss();
				}

				function _onEditError(err) {
					console.log('modal error');
					modalInstance.dismiss();
				}
			}
		}
	};
});