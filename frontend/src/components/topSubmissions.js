define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('topSubmissions', ['cardService', '$filter', function(cardService, $filter) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/topSubmissions.html',
				replace: true,
				link: function($scope, $element) {
					// $scope.$watch('pairIndex', $scope.onPairIndexChanged);
				},
				controller: function($scope, $element) {
					// public vars
					$scope.pageSize = 50;
					$scope.loading = false;
					$scope.suggestions = [];
					$scope.skipIndex = 0;
					$scope.allLoaded = false;

					// Private methods

					$scope.loadSuggestions = function() {
						if(!$scope.loading && !$scope.allLoaded) {
							$scope.loading = true;
							
							Parse.Cloud.run(
								'topSubmissionsByTotalVotes',
								{
									pageSize: $scope.pageSize,
									skipIndex: $scope.skipIndex
								}, 
								{
									success: onSuggestionsLoaded,
									error: onSuggestionsError
								}
							);
						}
					}

					function onSuggestionsLoaded(suggestions) {
						if(suggestions.length < $scope.pageSize) {
							$scope.allLoaded = true;
						}
						cardService.cache(suggestions);
						$scope.suggestions = $scope.suggestions.concat(suggestions);
						$scope.skipIndex += suggestions.length;
						$scope.loading = false;
						$scope.$digest();
					}

					function onSuggestionsError(error) {
						console.log('couldn\'t find any pairs:', error);
					}

					// // init
					$scope.loadSuggestions();

				}
			}
		}]);
	}
);