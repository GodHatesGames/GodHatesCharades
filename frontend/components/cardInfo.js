app.directive('cardInfo', function(cardService) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardInfo.html',
		replace: true,
		scope: {
			suggestion: '='
		},
		controller: function($scope, $element) {
			$scope.getKdr = _getKdr;
			$scope.getTotalVotes = _getTotalVotes;
			$scope.getTotalSkips = _getTotalSkips;
			$scope.getTypeDisplay = _getTypeDisplay;

			function _getKdr() {
				if($scope.suggestion)
					return cardService.getKDR(_getTotalVotes(), _getTotalSkips());
			}

			function _getTotalVotes() {
				if($scope.suggestion)
					return cardService.getTotalVotes($scope.suggestion);
			}

			function _getTotalSkips() {
				if($scope.suggestion)
					return cardService.getTotalSkips($scope.suggestion);
			}

			function _getTypeDisplay() {
				if($scope.suggestion)
					return cardService.getTypeDisplay($scope.suggestion);
			}
		}
	}
});