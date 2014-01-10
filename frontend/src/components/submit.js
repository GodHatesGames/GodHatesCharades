app.directive('submit', ['cardService', 'parseUser', function(cardService, parseUser) {
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
			} else if($scope.type === TYPE_THING) {
				$scope.example = randomEvents[rand];
			}
			
			$scope.typeDisplay = cardService.getTypeDisplayByType($scope.type);
			$scope.typeClass = cardService.getTypeClassByType($scope.type);

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
				if($scope.text.length > 0) {
					var Suggestion = Parse.Object.extend("Suggestion");
					var suggestion = new Suggestion();
					suggestion.set('text', $scope.text);
					suggestion.set('type', $scope.type);
					suggestion.set('owner', parseUser.data);
					suggestion.save({
						success: function(suggestion) {
							$scope.success = true;
							$scope.$digest();
						},
						error: function(suggestion, error) {
							console.log('error:', error.message);
						}
					});
				}
			}

			$scope.reset = function() {
				$scope.text = '';
				$scope.success = false;
			}
		}
	}
}]);