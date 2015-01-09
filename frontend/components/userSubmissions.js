app.directive('userSubmissions', function($filter, parseUser) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/userSubmissions.html',
		replace: false,
		scope: {
			suggestions: '='
		}
	}
});