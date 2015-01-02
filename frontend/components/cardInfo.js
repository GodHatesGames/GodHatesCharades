app.directive('cardInfo', function() {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardInfo.html',
		replace: true,
		scope: {
			suggestion: '='
		}
	}
});