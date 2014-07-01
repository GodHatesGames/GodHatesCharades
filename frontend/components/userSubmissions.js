app.directive('userSubmissions', function($filter, cardService, parseUser) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/userSubmissions.html',
		replace: false,
		scope: {
			userid: '=userid'
		},
		link: function($scope, $element) {
			// $scope.$watch('pairIndex', $scope.onPairIndexChanged);
		},
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;
			$scope.pageSize = 50;
			$scope.loading = false;
			$scope.suggestions = [];
			$scope.skipIndex = 0; //TODO: make private
			$scope.allLoaded = false;
			$scope.loadSuggestions = loadSuggestions;
			$scope.reloadSuggestions = reloadSuggestions;
			$scope.tab = 'best';
			// Private methods

			function reloadSuggestions(tab) {
				$scope.tab = tab;
				$scope.suggestions = [];
				$scope.skipIndex = 0;
				$scope.loadSuggestions();
			}

			function loadSuggestions() {
				if(!$scope.loading && !$scope.allLoaded) {
					$scope.loading = true;
					var options = {
						skipIndex: $scope.skipIndex,
						pageSize: $scope.pageSize,
						type: $scope.tab
					};
					parseUser.getProfileById($scope.userid, options)
					.then(onProfileLoaded, onProfileError);
					$scope.loading = true;
				}
			}

			function onProfileLoaded(profile) {
				if(profile.suggestions.length < $scope.pageSize) {
					$scope.allLoaded = true;
				}
				$scope.user = profile.owner;
				$scope.suggestions = $scope.suggestions.concat(profile.suggestions);
				$scope.loading = false;
				$scope.skipIndex += profile.suggestions.length;
			}

			function onProfileError(error) {
				console.log('couldn\'t find any pairs:', error);
			}

			// init
			loadSuggestions();

		}
	}
});