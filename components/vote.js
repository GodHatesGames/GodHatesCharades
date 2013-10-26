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
					$scope.$watch('pairIndex', $scope.onPairIndexChanged);
				},
				controller: function($scope, $element) {
					// public vars
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
					};

					function votePair(pair) {
						var pairIds = {};

						_.each(pair, function(suggestion, index) {
							pairIds[index] = suggestion.id;
						});

						console.log('pairIds:', pairIds);
						Parse.Cloud.run(
							'votePair',
							{
								'pair': pairIds
							},
							{
								success: onPairVoted,
								error: onPairVoteError
							}
						);
					}

					function onPairVoted(message) {
						console.log('vote success:', message);
					}

					function onPairVoteError(error) {
						console.log('error voting on pair:', error);
					}

					// Public Methods

					$scope.typeClass = function(suggestion) {
						var type = suggestion.get('type');
						if(type === 0) {
							return 'character';
						} else {
							return 'scenario';
						}
					};

					$scope.onPairIndexChanged = function(newValue, oldValue) {
						if($scope.suggestionPairSrc.length > 0) {
							updateSuggestionPairs();
						}
					};

					$scope.selectPair = function(selectedIndex) {
						console.log('selected:', selectedIndex);
						votePair($scope.suggestionPairs[selectedIndex]);

						// update current index
						$scope.pairIndex += $scope.pairLimit;
					};

					// init
					loadSuggestionPairs();

				}
			}
		}]);
	}
);