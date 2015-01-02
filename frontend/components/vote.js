'use strict';
app.directive('vote', function(cloudUtils, Suggestion, $q) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/vote.html',
		replace: true,
		controller: function($scope, $element) {
			// Watches
			$scope.$watch('pairIndex', _onPairIndexChanged);

			// public vars
			$scope.pairLimit = 2;
			$scope.loading = true;
			$scope.suggestionPairs = [];
			$scope.suggestionPairSrc = [];
			$scope.pairIndex = 0;

			// Public Methods
			$scope.skipBoth = _skipBoth;
			$scope.selectPair = _selectPair;
			$scope.onPairIndexChanged = _onPairIndexChanged;

			// Private methods

			function _loadSuggestionPairs(skip) {
				$scope.loading = true;
				Suggestion.getSuggestionPairs(skip)
				.then(_onSuggestionPairsLoaded, _onSuggestionPairsError);
			}

			function _onSuggestionPairsLoaded(suggestionPairs) {
				var descriptor = {
					value: true,
					enumerable: false
				};
				Object.defineProperty(suggestionPairs[0], 'first', descriptor);
				Object.defineProperty(suggestionPairs[1], 'first', descriptor);
				$scope.suggestionPairSrc = suggestionPairs;
				$scope.pairIndex = 0;
				$scope.loading = false;
				_updateSuggestionPairs();
			}

			function _onSuggestionPairsError(error) {
				console.log('couldn\'t find any pairs:', error);
			}

			function _updateSuggestionPairs() {
				var start = $scope.pairIndex;
				var end = $scope.pairIndex + $scope.pairLimit;
				console.log('index range:', start, end - 1);
				/* slice extracts up to but not including end */
				var newPairs = $scope.suggestionPairSrc.slice(start, end);
				if(newPairs.length === $scope.pairLimit) {
					$scope.suggestionPairs = newPairs;
				} else {
					console.log('load again');
					if(!$scope.loading) {
						// offset by one to keep from reselecting the current pair which may still be saving
						_loadSuggestionPairs(2);
					}
				}
			}

			function _onPairVoted(message) {
				// console.log('vote success:', message);

			}

			function _onPairVoteError(error) {
				console.log('error voting on pair:', error);
			}

			function _onPairIndexChanged(newValue, oldValue) {
				if($scope.suggestionPairSrc.length > 0) {
					_updateSuggestionPairs();
				}
			};

			function _selectPair($event, selectedIndex) {

				// add class to the chosen pair
				angular.element($event.currentTarget).addClass('chosen');

				console.log('selected:', selectedIndex);
				var opposite = selectedIndex === 0 ? 1 : 0;
				var chosenPair = $scope.suggestionPairs[selectedIndex];
				var skippedPair = $scope.suggestionPairs[opposite];
				var params = {
						chosenActor: chosenPair[0].id,
						chosenScenario: chosenPair[1].id,
						skippedActor: skippedPair[0].id,
						skippedScenario: skippedPair[1].id
				};
				var deferred = $q.defer();
				Parse.Cloud.run(
					CONFIG.PARSE_VERSION + 'recordChosenAndSkipped',
					cloudUtils.getDefaultParams(params),
					{
						success: deferred.resolve,
						error: deferred.reject
					}
				);
				// update current index
				$scope.pairIndex += $scope.pairLimit;

				deferred.promise.then(_onPairVoted, _onPairVoteError)

				// Track
				ga('send', 'event', 'vote', 'pair');
			};

			function _skipBoth() {
				var skippedIds = [];
				_.each($scope.suggestionPairs, function(pair, index) {
					_.each(pair, function(suggestion, index) {
						if(suggestion.id)
							skippedIds.push(suggestion.id);
					});
				});

				var deferred = $q.defer();

				Parse.Cloud.run(
					CONFIG.PARSE_VERSION + 'skipSuggestions',
					{
						'skippedIds': skippedIds
					},
					{
						success: deferred.resolve,
						error: deferred.reject
					}
				);
				// update current index
				$scope.pairIndex += $scope.pairLimit;

				deferred.promise.then(_onPairVoted, _onPairVoteError)

				// Track
				ga('send', 'event', 'vote', 'skip');
			};

			// init
			_loadSuggestionPairs();

		}
	};
});