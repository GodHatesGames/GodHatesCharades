'use strict';
app.directive('cardForm', function(Suggestion) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardForm.html',
		replace: true,
		scope: {
			suggestion: '=',
			saveOnSubmit: '=',
			onSuccess: '=',
			onError: '='
		},
		controller: function($scope, $element) {
			$scope.saveSuggestion = _saveSuggestion;
			$scope.saving = false;
			$scope.updates = {
				suggestionId: $scope.suggestion.id,
				text: $scope.suggestion.text,
				legal: $scope.suggestion.legal,
				spite: $scope.suggestion.spite
			}

			function _saveSuggestion() {
				if($scope.saveOnSubmit !== false) {
					$scope.saving = true;
					Suggestion.update($scope.updates.suggestionId, $scope.updates)
					.then(_onSuggestionSaved, _onSuggestionError);
				}

				function _onSuggestionSaved (savedSuggestion) {
					console.log('suggestion saved');
					$scope.saving = false;
					if($scope.onSuccess)
						$scope.onSuccess(savedSuggestion);
				}

				function _onSuggestionError (error) {
					console.error('error saving suggestion:', error);
					$scope.saving = false;
					if($scope.onError)
						$scope.onError(error);
				}
			};
		}
	};
});