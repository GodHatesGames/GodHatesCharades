define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('suggestions', ['$compile', function($compile) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/suggestions.html',
				replace: true,
				scope: true,
				link: function($scope, $element) {
					// $scope.loadSuggestions()
				},
				controller: function($scope, $element) {
					$scope.visibleSuggestions = [];
					$scope.allSuggestions = {};
					$scope.suggestionsLoaded = 0;
					$scope.zeroCount = 0;
					$scope.oneCount = 0;
					$scope.filterOptions = {
						filterText: "",
						useExternalFilter: true
					};
					$scope.pagingOptions = {
						pageSizes: [1000],
						pageSize: 1000,
						currentPage: 1
					};
					$scope.gridOptions = {
						data: 'visibleSuggestions',
						totalServerItems: 'totalServerItems',
						enableHighlighting: true,
						enableRowSelection: false,
						enablePaging: true,
						// showFooter: true,
						pagingOptions: $scope.pagingOptions,
						columnDefs: [
						{
							field: 'attributes.text',
							displayName: 'Text'
						}, {
							field: 'attributes.type',
							displayName: 'Type',
							width: 60
						}]
					};
					$scope.totalServerItems = 0;
					$scope.getSkip = function() {
						return ($scope.pagingOptions.currentPage - 1) * $scope.pagingOptions.pageSize;
					}

					$scope.onSuggestionsLoaded = function(suggestions) {
						var suggestion, type;
						$scope.visibleSuggestions = [];
						for(var i = 0; i < suggestions.length; i++) {
							suggestion = suggestions[i];
							
							// save in visible array
							$scope.visibleSuggestions.push(suggestion);

							// record all loaded suggestions
							if(!$scope.allSuggestions[suggestion.id]) {
								$scope.allSuggestions[suggestion.id] = suggestion;
								type = suggestion.get('type');
								if(type === 0)
									$scope.zeroCount++;
								else if(type === 1)
									$scope.oneCount++;
								$scope.suggestionsLoaded++;
							}
						}

						$scope.totalServerItems = $scope.getSkip() + $scope.pagingOptions.pageSize;
						if($scope.visibleSuggestions.length === $scope.pagingOptions.pageSize)
							$scope.totalServerItems += $scope.pagingOptions.pageSize;
						if($scope.totalServerItems < $scope.suggestionsLoaded)
							$scope.totalServerItems = $scope.suggestionsLoaded;

						if (!$scope.$$phase) {
							$scope.$apply();
						} 
					}

					$scope.loadSuggestions = function (pageSize, page, filter) {
						if(filter && filter.length > 0) {
							var filteredList = [];
							var filterText = filter.toLowerCase();
							for(var suggestionId in $scope.allSuggestions) {
								suggestion = $scope.allSuggestions[suggestionId];
								text = suggestion.get('text').toLowerCase();
								if(text.indexOf(filterText) > -1) {
									filteredList.push(suggestion);
								}
							}
							$scope.onSuggestionsLoaded(filteredList);
						} else {
							var SuggestionObject = Parse.Object.extend("Suggestion");
							var query = new Parse.Query(SuggestionObject);
							query.limit(pageSize);
							query.skip($scope.getSkip());
							if(filter) {
								console.log('filter:', filter);
								query.startsWith('text', filter);
							}
							query.find({
								success: $scope.onSuggestionsLoaded
							});
						}
					};
						
						$scope.loadSuggestions($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

					$scope.$watch('pagingOptions', function (newVal, oldVal) {
						if ((newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) ||
							newVal.filterUpdated) {
							console.log('fetch after page options updated');
							$scope.pagingOptions.filterUpdated = false;
							$scope.loadSuggestions($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
						}
					}, true);
					$scope.$watch('filterOptions', function (newVal, oldVal) {
						if (newVal !== oldVal) {
							$scope.pagingOptions.currentPage = 1;
							$scope.pagingOptions.filterUpdated = true;
							// $scope.loadSuggestions($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
						}
					}, true);
				}
			}
		}]);
	}
);