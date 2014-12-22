app.directive('cardLink', function(cardService) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardLink.html',
		replace: true,
		scope: {
			suggestion: '='
		},
		controller: function($scope, $element) {
			$scope.getLink = _getLink;

			function _getLink() {
				if($scope.suggestion)
					return cardService.getLink($scope.suggestion);
			}
		}
	}
});