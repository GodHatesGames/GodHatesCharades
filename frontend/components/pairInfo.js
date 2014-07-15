app.directive('pairInfo', function(parseUser, pairService, $rootScope) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/pairInfo.html',
		replace: true,
		scope: {
			id: '=id'
		},
		controller: function($scope, $element) {
			var promise = pairService.getPairById($scope.id);
			promise.then(onSuccess, onError);

			function onSuccess(pair) {
				$scope.pair = pair;
				if(!$rootScope.$$phase)
					$scope.$digest();
			}

			function onError(error) {
				console.log('error fetching pair:', error);
			}
		}
	}
});