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
					var laterTimeoutId;

					// public vars
					$scope.loading = false;
					$scope.characters = [{}];
					$scope.scenarios = [{}];

					// init
					loadExamples();

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
						if(!laterTimeoutId)
							updateSoonerThanLater();
						//force update now
						$scope.$digest();
						$scope.$apply()
					}

					function onExamplesError(error) {
						console.log('couldn\'t find any pairs:', error);
					}

					function updateSoonerThanLater() {
						$timeout(function() {
							currentIndex++;
							$scope.$digest();
							updateLater(); // schedule another update
						}, 100);
					}

					// schedule update in one second
					function updateLater() {
						// save the laterTimeoutId for canceling
						laterTimeoutId = $timeout(function() {
							currentIndex++;
							$scope.$digest();
							updateLater(); // schedule another update
						}, 5000);
					}

					// Public Methods
					$scope.cardClass = function(index) {
						// if(index + 1 < currentIndex)
						// 	return 'exampleBehind';
						// else if(index === currentIndex || index === currentIndex - 1)
						// 	return 'exampleActive';
						// else
						// 	return 'exampleStaging';
						if(currentIndex < index)
							return 'exampleStaging';
						else
							return 'exampleActive';
					}
				}
			}
		}]);
	}
);