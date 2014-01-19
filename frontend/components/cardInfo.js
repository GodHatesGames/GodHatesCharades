app.directive('cardInfo', function(parseUser, cardService, $rootScope) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardInfo.html',
		replace: true,
		scope: {
			id: '=id'
		},
		controller: function($scope, $element) {
			$scope.totalVotes = 0;
			$scope.totalSkips = 0;
			$scope.typeDisplay = "";
			$scope.kdr = 0;
			$scope.cardOwnerName = "";
			$scope.cardOwnerId = "";
			var promise = cardService.getCard($scope.id);
			promise.then(onSuccess, onError);

			function onSuccess(card) {
				$scope.card = card;
				$scope.totalVotes = cardService.getTotalVotes(card);
				$scope.totalSkips = cardService.getTotalSkips(card);
				$scope.typeDisplay = cardService.getTypeDisplay(card);
				$scope.kdr = cardService.getKDR($scope.totalVotes, $scope.totalSkips);
				$scope.cardOwnerName = card.get('owner').get('name');
				$scope.cardOwnerId = card.get('owner').id;
				if(!$rootScope.$$phase)
					$scope.$digest();
			}

			function onError(error) {
				console.log('error fetching card:', error);
			}
		}
	}
});