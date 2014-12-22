app.directive('cardLink', function(cardService) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardLink.html',
		replace: true,
		scope: {
			suggestion: '='
		}
	}
});