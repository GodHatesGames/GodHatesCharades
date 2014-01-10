app.directive('nav', ['parseUser', 'campaignService', function(parseUser, campaignService) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/nav.html',
		replace: true,
		scope: true,
		controller: function($scope, $element) {
			$scope.parseUser = parseUser;
			$scope.kickstarter = true;
		}
	}
}]);