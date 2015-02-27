app.directive('submit', function(Suggestion, User) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/submit.html',
		replace: true,
		scope: {
			type: '='
		},
		link: function($scope, $element, attr) {
			$scope.$watch('mockSuggestion.text', $scope.onTextChange);
		},
		controller: function($scope, $element) {
			var TYPE_PERSON = 0;
			var TYPE_THING = 1;
			var randomPeople = [
				'BILL O\'REILLY',
				'BARACK OBAMA',
				'HONEY BOO BOO',
				'THE LITTLE ENGINE THAT COULD'
			];
			var randomEvents = [
				'FEEDING CATS TO AN ATM.',
				'TELLING THEIR IMAGINARY FRIEND THEY\'RE TOO OLD TO HAVE AN IMAGINARY FRIEND.',
				'TRAPPED IN R KELLY\'S CLOSET.',
				'JOINING THE OFFICE FIGHT CLUB.'
			];

			$scope.mockSuggestion = Suggestion.getBlankCardByType($scope.type);
			$scope.maxChars = 75;
			$scope.success = false;
			$scope.User = User;
			$scope.typeDisplay = '';
			$scope.typeClass = '';

			var halfMax = $scope.maxChars / 2;

			if($scope.type === TYPE_PERSON) {
				var rand = Math.floor(Math.random() * randomPeople.length);
				$scope.example = randomPeople[rand];
			} else if($scope.type === TYPE_THING) {
				var rand = Math.floor(Math.random() * randomEvents.length);
				$scope.example = randomEvents[rand];
			}
			
			$scope.onTextChange = function(newValue, oldValue) {
				if(newValue === undefined || newValue === null)
					$scope.mockSuggestion.text = '';
				else
					$scope.mockSuggestion.DSCompute();
			}
			$scope.characterCount = function() {
				if($scope.mockSuggestion.text !== undefined) {
					if($scope.mockSuggestion.text.length < halfMax)
						return 'alert-success';
					if($scope.mockSuggestion.text.length < $scope.maxChars)
						return 'alert-warning';
					else
						return 'alert-danger';
				}
			};

			$scope.submit = function() {
				if($scope.mockSuggestion.text.length > 0) {
					var newSuggestion = {
						text: $scope.mockSuggestion.text,
						type: $scope.mockSuggestion.type,
						userId: User.current.id
					}
					Suggestion.create(newSuggestion)
					.then(_onSubmitSuccess);
				}
			}
			
			function _onSubmitSuccess(suggestion) {
				$scope.success = true;
				$scope.$digest();
			}

			$scope.reset = function() {
				$scope.text = '';
				$scope.success = false;
			}
		}
	}
});