app.directive('pairInfo', function(parseUser, Pair, $rootScope) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/pairInfo.html',
		replace: true,
		scope: {
			id: '=id'
		},
		controller: function($scope, $element) {
			$scope.times = {'0': ' times',
			                'one': ' time',
			                'other': ' times'};
			$scope.person = {'one': ' person ',
		                     'other': ' people '};

			$scope.$watch('id', onIdChanged);

			function onIdChanged(newValue) {
				Pair.find(newValue)
				.then(onSuccess, onError);
			}

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