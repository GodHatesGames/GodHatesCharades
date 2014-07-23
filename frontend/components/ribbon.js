app.directive('ribbon', function(parseUser, cardService, $rootScope) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/ribbon.html',
		replace: true,
		scope: {
			message: '=message'
		}
	}
});