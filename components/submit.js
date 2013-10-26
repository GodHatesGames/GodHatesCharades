define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('submit', ['SuggestionService', 'parseUser', function(SuggestionService, parseUser) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/submit.html',
				replace: true,
				scope: {
					type: '=type'
				},
				link: function($scope, $element, attr) {
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
						'being an accidental racist.',
						'worshiping Satan.',
						'selling drugs to the pope.',
						'slashing tires.'
					];

					$scope.text = '';
					$scope.maxChars = 75;
					$scope.success = false;
					$scope.parseUser = parseUser;
					$scope.typeDisplay = '';
					$scope.typeClass = '';
					$scope.displayName = function() {
						return ' ' + parseUser.data.get('name');
					}

					var halfMax = $scope.maxChars / 2;

					var rand = Math.floor(Math.random() * 5);
					if($scope.type === TYPE_PERSON) {
						$scope.example = randomPeople[rand];
						$scope.typeDisplay = 'Character';
						$scope.typeClass = 'character';
					} else if($scope.type === TYPE_THING) {
						$scope.example = randomEvents[rand];
						$scope.typeDisplay = 'Scenario';
						$scope.typeClass = 'scenario';
					}

					$scope.onTextChange = function(newValue, oldValue) {
						if(newValue === undefined || newValue === null)
							$scope.text = '';
					}
					$scope.characterCount = function() {
						if($scope.text !== undefined) {
							if($scope.text.length < halfMax)
								return 'alert-success';
							if($scope.text.length < $scope.maxChars)
								return 'alert-warning';
							else
								return 'alert-danger';
						}
					};

					$scope.submit = function() {
						var suggestions = new SuggestionService.collection()
						var promise = suggestions.addSuggestion($scope.text, $scope.type, parseUser.data);
						promise.then(function() {
							$scope.success = true;
						});
					}

					$scope.reset = function() {
						$scope.text = '';
						$scope.success = false;
					}
				}
			}
		}]);
	}
);