'use strict';
app.directive('cardForm', function(cardService) {
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
			$scope.cardService = cardService;
			$scope.saveSuggestion = _saveSuggestion;

			function _saveSuggestion() {
				if($scope.saveOnSubmit !== false) {
					$scope.saving = true;
					Parse.Cloud.run(
						CONFIG.PARSE_VERSION + 'updateSuggestionText',
						{
							suggestionId: $scope.suggestion.id,
							text: $scope.suggestion.get('text'),
							legal: $scope.suggestion.get('legal')
						},
						{
							success: onSuggestionSaved,
							error: onSuggestionError
						}
					);
				}

				function onSuggestionSaved (savedSuggestion) {
					console.log('suggestion saved');
					$scope.saving = false;
					$scope.$digest();
					if($scope.onSuccess)
						$scope.onSuccess(savedSuggestion);
				}

				function onSuggestionError (error) {
					console.error('error saving suggestion:', error);
					$scope.saving = false;
					$scope.$digest();
					if($scope.onError)
						$scope.onError(error);
				}
			};
		}
	};
});