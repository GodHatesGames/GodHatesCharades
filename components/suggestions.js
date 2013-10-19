define([
	'angular',
	'app',
	'dt/Suggestion'
	], 
	function(angular, app) {

		app.directive('suggestions', ['$compile', 'SuggestionService', function($compile, SuggestionService) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/suggestions.html',
				replace: true,
				scope: true,
				link: function($scope, $element) {
					var suggestions = new SuggestionService.collection();
					var suggestionsPromise = suggestions.load();
					suggestionsPromise.then($scope.onSuggestionsLoaded);
				},
				controller: function($scope, $element) {
					$scope.suggestions = [];
					$scope.zeroCount = 0;
					$scope.oneCount = 0;
					$scope.gridOptions = {
						data: 'suggestions',
						enableHighlighting: true,
						enableRowSelection: false,
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

					$scope.onSuggestionsLoaded = function(suggestions) {
						var suggestionsArr = suggestions.toArray();
						var suggestion, type;
						for(var i = 0; i < suggestionsArr.length; i++) {
							suggestion = suggestionsArr[i];
							$scope.suggestions.push(suggestion);
							type = suggestion.get('type');
							if(type === 0)
								$scope.zeroCount++;
							else if(type === 1)
								$scope.oneCount++;
						}

						console.log('suggestions:', $scope.suggestions);
					}
				}
			}
		}]);
	}
);