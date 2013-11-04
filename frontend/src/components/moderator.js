define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('moderator', ['cardService', '$compile', function(cardService, $compile) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/moderator.html',
				replace: true,
				scope: true,
				controller: function($scope, $element) {
					// public vars
					var suggestions = [];
					$scope.index = 0;
					$scope.loading = true;
					$scope.suggestion = null;
					$scope.legalMod = '';
					
					Parse.Cloud.run(
						'getUnmoderatedSuggestions',
						{}, 
						{
							success: onSuggestionsLoaded,
							error: onSuggestionsError
						}
					);

					// Private methods

					function onSuggestionsLoaded(newSuggestions) {
						suggestions = newSuggestions;
						cardService.cache(suggestions);
						$scope.loading = false;
						$scope.suggestion = suggestions[$scope.index];
						$scope.$digest();
					}

					function loadNext() {
						$scope.index++;
						$scope.suggestion = suggestions[$scope.index];
						$compile($element);
					}

					function onSuggestionsError(error) {
						console.log('couldn\'t find any unapproved suggestions:', error);
					}

					// Public Methods

					$scope.skip = function() {
						console.log('skip:', $scope.suggestion.id);
						loadNext();
					}

					$scope.approve = function() {
						$scope.suggestion.set('moderated', true);
						$scope.suggestion.set('rejected', false);
						$scope.suggestion.save();

						loadNext();
					}

					$scope.disapprove = function() {
						$scope.suggestion.set('moderated', true);
						$scope.suggestion.set('rejected', true);
						$scope.suggestion.save();

						loadNext();
					}

					// Watch
					$scope.$watch('legalMod', function(newValue, oldValue, scope) {
						if($scope.suggestion) {
							var currentText = $scope.suggestion.get('text');
							var sansLegal = currentText.replace(/ (®|©|™)/, '');
							$scope.suggestion.set('text', sansLegal + ' ' + $scope.legalMod);
						}
					});

				}
			}
		}]);
	}
);