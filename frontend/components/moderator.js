app.directive('moderator', function(Suggestion, $compile, $rootScope) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/moderator.html',
		replace: true,
		scope: true,
		controller: function($scope, $element) {

		}
	}
});