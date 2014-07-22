app.directive('topSubmissions', function(pairService, $filter, $state, parseUser) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/topSubmissions.html',
		replace: true,
		link: function($scope, $element) {
			// $scope.$watch('pairIndex', $scope.onPairIndexChanged);
		},
		controller: function($scope, $element) {
			// public vars
			$scope.pairService = pairService;
			$scope.pageSize = 51;
			$scope.loading = false;
			$scope.pairs = [];
			$scope.skipIndex = 0; //TODO: make private
			$scope.allLoaded = false;
			$scope.parseUser = parseUser;
			$scope.tab = 'best';

			// Private methods

			$scope.reloadPairs = function(tab) {
				$scope.tab = tab;
				$scope.pairs = [];
				$scope.skipIndex = 0;
				$scope.allLoaded = false;
				$scope.loadPairs();
			}

			$scope.loadPairs = function() {
				console.log($state.current.name);
				if(!$scope.loading && !$scope.allLoaded) {
					var options = {
						pageSize: $scope.pageSize,
						skipIndex: $scope.skipIndex,
						type: $scope.tab
					};
					var callbacks = {
						success: onPairsLoaded,
						error: onPairsError
					};
					$scope.loading = true;
					Parse.Cloud.run(CONFIG.PARSE_VERSION + 'topPairs', options, callbacks);
				}
			}

			function onPairsLoaded(pairs) {
				if(pairs.length < $scope.pageSize) {
					$scope.allLoaded = true;
				}
				$scope.pairs = $scope.pairs.concat(pairs);
				$scope.skipIndex += pairs.length;
				$scope.loading = false;
				$scope.$digest();
			}

			function onPairsError(error) {
				console.log('couldn\'t find any pairs:', error);
			}

			// // init
			$scope.loadPairs();

		}
	}
});