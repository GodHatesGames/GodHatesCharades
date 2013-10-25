define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('vote', [function() {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/vote.html',
				replace: true,
				link: function($scope, $element) {

				},
				controller: function($scope, $element) {
					$scope.pairLimit = 2;
					$scope.loading = true;
					$scope.suggestionPairs = [];
					$scope.suggestionIndex = 0;
					loadSuggestionPairs();

					function loadSuggestionPairs() {
						Parse.Cloud.run('getRandomSuggestionPairs', {
							skip: 0
						}, {
							success: onSuggestionPairsLoaded,
							error: onSuggestionPairsError
						});
					}

					function onSuggestionPairsLoaded(suggestionPairs) {
						$scope.suggestionPairs = suggestionPairs;
						$scope.loading = false;
						$scope.suggestionIndex = 0;
						$scope.$digest();
					}

					function onSuggestionPairsError(error) {
						console.log('couldn\'t find any pairs:', error);
					}

					$scope.typeClass = function(suggestion) {
						var type = suggestion.get('type');
						if(type === 0)
							return 'character';
						else
							return 'scenario';
					}

					$scope.selectPair = function(index) {
						console.log('selected:', index);
					}

				}
			}
		}]);
	}
);