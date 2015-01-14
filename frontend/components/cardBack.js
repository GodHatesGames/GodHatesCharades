app.directive('card', function(Suggestion, $rootScope) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/cardBack.html',
		replace: true,
		scope: {
			type: '=type'
		},
		controller: function($scope, $element) {
			$scope.typeClass = Suggestion.getTypeClassByType($scope.type);
		}
	}
});