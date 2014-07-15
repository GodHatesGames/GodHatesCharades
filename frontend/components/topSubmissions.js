app.directive('topSubmissions', function(cardService, $filter, $state) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/topSubmissions.html',
		replace: true,
		link: function($scope, $element) {
			// $scope.$watch('pairIndex', $scope.onPairIndexChanged);
		},
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;
			$scope.pageSize = 51;
			$scope.loading = false;
			$scope.suggestions = [];
			$scope.skipIndex = 0; //TODO: make private
			$scope.allLoaded = false;
			$scope.tab = 'best';

			// Private methods

			$scope.reloadSuggestions = function(tab) {
				$scope.tab = tab;
				$scope.suggestions = [];
				$scope.skipIndex = 0;
				$scope.allLoaded = false;
				$scope.loadSuggestions();
			}

			$scope.loadSuggestions = function() {
				console.log($state.current.name);
				if(!$scope.loading && !$scope.allLoaded) {
					var options = {
						pageSize: $scope.pageSize,
						skipIndex: $scope.skipIndex,
						type: $scope.tab
					};
					var callbacks = {
						success: onSuggestionsLoaded,
						error: onSuggestionsError
					};
					$scope.loading = true;
					Parse.Cloud.run(CONFIG.PARSE_VERSION + 'topSubmissions', options, callbacks);
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
});