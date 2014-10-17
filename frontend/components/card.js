'use strict';
app.directive('card', function(parseUser, cardService) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/card.html',
		replace: true,
		scope: {
			suggestion: '=',
			blankType: '=',
			domain: '='
		},
		controller: function($scope, $element) {
			$scope.cardService = cardService;
			$scope.imageUrl = _imageUrl;
			$scope.typeClass = _typeClass;

			function _imageUrl() {
				if($scope.blankType) {
					return cardService.getImageByType($scope.blankType);
				} else if($scope.suggestion) {
					return cardService.getImageUrl($scope.suggestion);
				}
			}

			function _typeClass() {
				if($scope.blankType) {
					return cardService.getTypeClassByType($scope.blankType);
				} else if($scope.suggestion) {
					return cardService.getTypeClass($scope.suggestion);
				}
			}
		}
	};
});