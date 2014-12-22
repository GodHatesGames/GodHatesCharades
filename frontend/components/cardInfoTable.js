app.directive('cardInfoTable', function(cardService) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardInfoTable.html',
		replace: true,
		scope: {
			suggestion: '='
		}
	}
});