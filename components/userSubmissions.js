define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('userSubmissions', ['SuggestionService', '$filter', function(SuggestionService, $filter) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/userSubmissions.html',
				replace: false,
				scope: {
					userid: '=userid'
				},
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

						var Suggestion = Parse.Object.extend("Suggestion");
						var owner = new Parse.User();
						owner.id = $scope.userid;
						var query = new Parse.Query(Suggestion);
						query.descending('totalVotes');
						query.equalTo("owner", owner);
						query.include('owner');
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

					$scope.getTotalSkips = function(suggestion) {
						var totalSkips = suggestion.get('skipped');
						return totalSkips ? totalSkips : 0;
					}

					$scope.getKDR = function(kills, deaths) {
						if(deaths === 0)
							return '∞';
						else
							return kills / deaths;
					}

					// init
					loadSuggestions();

				}
			}
		}]);
	}
);