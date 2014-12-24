app.directive('cardInfoTable', function() {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardInfoTable.html',
		replace: true,
		scope: {
			suggestion: '='
		}
	}
});