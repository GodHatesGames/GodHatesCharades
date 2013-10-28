define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('topSubmissions', ['SuggestionService', '$filter', function(SuggestionService, $filter) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/topSubmissions.html',
				replace: true,
				link: function($scope, $element) {
					$scope.$watch('pairIndex', $scope.onPairIndexChanged);
				},
				controller: function($scope, $element) {
					// public vars
					$scope.pageSize = 50;
					$scope.loading = true;
					$scope.suggestions = [];
					$scope.pairIndex = 0;

					// Private methods

					function loadSuggestions() {
						$scope.loading = true;
						
						var SuggestionObject = Parse.Object.extend("Suggestion");
						var query = new Parse.Query(SuggestionObject);
						query.descending('totalVotes');
						query.limit($scope.pageSize);
						query.include('owner');
						// query.skip($scope.getSkip());
						query.find({
							success: onSuggestionsLoaded,
							error: onSuggestionsError
						});
					}

					function onSuggestionsLoaded(suggestions) {
						$scope.suggestions = $scope.suggestions.concat(suggestions);
						$scope.loading = false;
						$scope.$digest();
					}

					function onSuggestionsError(error) {
						console.log('couldn\'t find any pairs:', error);
					}

					$scope.getTypeDisplay = function(suggestion) {
						return SuggestionService.getTypeDisplay(suggestion.get('type'));
					};

					$scope.getTypeClass = function(suggestion) {
						return SuggestionService.getTypeClass(suggestion.get('type'));
					};

					$scope.getTotalVotes = function(suggestion) {
						var totalVotes = suggestion.get('totalVotes');
						return totalVotes ? totalVotes : 0;
					}

					// init
					loadSuggestions();

				}
			}
		}]);
	}
);