define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('submit', [function() {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/submit.html',
				replace: true,
				scope: {
					type: '=type'
				},
				link: function($scope, $element, attr) {
					$scope.text = '';
					$scope.maxChars = 75;

					$scope.$watch('text', $scope.onTextChange);
				},
				controller: function($scope, $element) {
					var TYPE_PERSON = 0;
					var TYPE_THING = 1;
					var randomPeople = [
						'Bill O\'Reilly',
						'Barack Obama',
						'Jesus',
						'Cookie Monster',
						'The little engine that could'
					];
					var randomEvents = [
						'sexting orphans.',
						'being accidentally racist.',
						'worshiping Satan.',
						'selling drugs to the pope.',
						'slashing tires.'
					];

					var halfMax = $scope.maxChars / 2;

					var rand = Math.floor(Math.random() * 5);
					if($scope.type === TYPE_PERSON) {
						$scope.example = randomPeople[rand];
						$scope.displayType = 'Person';
					} else if($scope.type === TYPE_THING) {
						$scope.example = randomEvents[rand];
						$scope.displayType = 'Event';
					}

					$scope.onTextChange = function(newValue, oldValue) {
						if(newValue === undefined || newValue === null)
							$scope.text = '';
					}
					$scope.characterCount = function() {
						if($scope.text) {
							if($scope.text.length < halfMax)
								return 'alert-success';
							if($scope.text.length < $scope.maxChars)
								return 'alert-warning';
							else
								return 'alert-danger';
						}
					};
				}
			}
		}]);
	}
);