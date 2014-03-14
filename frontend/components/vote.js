'use strict';
app.directive('vote', function(cardService, cloudUtils) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/vote.html',
		replace: true,
		link: function($scope, $element) {
			$scope.$watch('pairIndex', $scope.onPairIndexChanged);
		},
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;
			$scope.pairLimit = 2;
			$scope.loading = true;
			$scope.suggestionPairs = [];
			$scope.suggestionPairSrc = [];
			$scope.pairIndex = 0;

			// Private methods

			function loadSuggestionPairs(skip) {
				$scope.loading = true;
				
				Parse.Cloud.run(
					'getRandomSuggestionPairs',
					{
						'skip': skip
					},
					{
						success: onSuggestionPairsLoaded,
						error: onSuggestionPairsError
					}
				);
			}

			function onSuggestionPairsLoaded(suggestionPairs) {
				_.each(suggestionPairs, function(pair, index) {
					cardService.cache(pair);
				});
				$scope.suggestionPairSrc = $scope.suggestionPairSrc.concat(suggestionPairs);
				$scope.loading = false;
				updateSuggestionPairs();
				$scope.$digest();
			}

			function onSuggestionPairsError(error) {
				console.log('couldn\'t find any pairs:', error);
			}

			function updateSuggestionPairs() {
				var start = $scope.pairIndex;
				var end = $scope.pairIndex + $scope.pairLimit;
				console.log('index range:', start, end - 1);
				/* slice extracts up to but not including end */
				var newPairs = $scope.suggestionPairSrc.slice(start, end);
				if(newPairs.length === $scope.pairLimit)
					$scope.suggestionPairs = newPairs;
				 else {
					console.log('load again');
					if(!$scope.loading)
						loadSuggestionPairs($scope.pairIndex);
				}
			}

			function onPairVoted(message) {
				console.log('vote success:', message);
			}

			function onPairVoteError(error) {
				console.log('error voting on pair:', error);
			}

			// Public Methods

			$scope.onPairIndexChanged = function(newValue, oldValue) {
				if($scope.suggestionPairSrc.length > 0) {
					updateSuggestionPairs();
				}
			};

			$scope.selectPair = function(selectedIndex) {
				console.log('selected:', selectedIndex);
				var opposite = selectedIndex === 0 ? 1 : 0;
				var chosenPair = $scope.suggestionPairs[selectedIndex];
				var skippedPair = $scope.suggestionPairs[opposite];
				var params = {
						'chosenActor': chosenPair[0].id,
						'chosenScenario': chosenPair[1].id,
						'skippedActor': skippedPair[0].id,
						'skippedScenario': skippedPair[1].id
				};
				Parse.Cloud.run(
					'recordChosenAndSkipped',
					cloudUtils.getDefaultParams(params),
					{
						success: onPairVoted,
						error: onPairVoteError
					}
				);

				// update current index
				$scope.pairIndex += $scope.pairLimit;
			};

			$scope.skipBoth = function() {
				var skippedIds = [];
				_.each($scope.suggestionPairs, function(pair, index) {
					_.each(pair, function(suggestion, index) {
						if(suggestion.id)
							skippedIds.push(suggestion.id);
					});
				});

				Parse.Cloud.run(
					'skipSuggestions',
					{
						'skippedIds': skippedIds
					},
					{
						success: onPairVoted,
						error: onPairVoteError
					}
				);

				// update current index
				$scope.pairIndex += $scope.pairLimit;
			};

			// init
			loadSuggestionPairs();

		}
	};
});