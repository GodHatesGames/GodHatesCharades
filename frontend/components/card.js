'use strict';
app.directive('card', function(parseUser, cardService, $rootScope) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/card.html',
		replace: true,
		scope: {
			cardId: '=cardId',
			updatable: '=updatable',
			blankType: '=blankType'
		},
		controller: function($scope, $element) {
			$scope.typeClass = '';
			$scope.imageUrl = '';
			if($scope.cardId) {
				var promise = cardService.getCard($scope.cardId);
				promise.then(onSuccess, onError);
			} else if($scope.blankType !== undefined && $scope.blankType !== null) {
				$scope.typeClass = cardService.getTypeClassByType($scope.blankType);
				$scope.imageUrl = cardService.getImageByType($scope.blankType);
			}

			if($scope.updatable === true) {
				$scope.$watch('cardId', function(newValue, oldValue) {
					if(newValue) {
						console.log('id changed to:', newValue, 'from', oldValue);
						var promise = cardService.getCard($scope.cardId);
						promise.then(onSuccess, onError);
					}
				});
			}

			function onSuccess(card) {
				$scope.card = card;
				$scope.typeClass = cardService.getTypeClass(card);
				$scope.imageUrl = cardService.getImageUrl(card);
			}

			function onError(error) {
				console.log('error fetching card:', error);
			}
		}
	};
});