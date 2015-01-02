app.directive('ribbon', function() {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/ribbon.html',
		replace: true,
		scope: {
			message: '=message'
		}
	}
});