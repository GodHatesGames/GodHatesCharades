define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('examples', ['cardService', '$timeout', function(cardService, $timeout) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/examples.html',
				replace: true,
				link: function($scope, $element) {
				},
				controller: function($scope, $element) {
					// private vars
					var currentIndex = 0;
					var timeoutId;

					// public vars
					$scope.loading = false;
					$scope.characters = [];
					$scope.scenarios = [];

					// init
					loadExamples();
					updateLater();

					// Private methods

					function loadExamples() {
						if(!$scope.loading) {
							$scope.loading = true;
							
							Parse.Cloud.run(
								'examples',
								{},
								{
									success: onExamplesLoaded,
									error: onExamplesError
								}
							);
						}
					}

					function onExamplesLoaded(examples) {
						$scope.loading = false;
						$scope.characters = $scope.characters.concat(examples['zero']);
						$scope.scenarios = $scope.scenarios.concat(examples['one']);
						$scope.$digest();
					}

					function onExamplesError(error) {
						console.log('couldn\'t find any pairs:', error);
					}

					// schedule update in one second
					function updateLater() {
						// save the timeoutId for canceling
						timeoutId = $timeout(function() {
							currentIndex++;
							$scope.$digest();
							updateLater(); // schedule another update
						}, 4000);
					}

					// Public Methods
					$scope.cardClass = function(index) {
						if(index < currentIndex)
							return 'exampleBehind';
						else if(currentIndex === index)
							return 'exampleActive';
						else
							return 'exampleStaging'
					}
				}
			}
		}]);
	}
);