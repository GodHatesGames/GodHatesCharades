app.directive('pairInfo', function(parseUser, pairService, $rootScope) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/pairInfo.html',
		replace: true,
		scope: {
			id: '=id'
		},
		controller: function($scope, $element) {
			$scope.alwaysShow = {'0': 'Nobody has seen this pair...',
			                     'one': 'This pair was voted on once,',
			                     'other': 'This pair was voted on {{pair.attributes.displayed}} times,'
			                    };

			$scope.halfsies = {'other': 'and half thought it was funny, the other half thought it wasn\'t.'
			                   };

			$scope.onlyFunny = {'one': 'and they thought it was funny.',
			                    'other': 'and they all thought it was funny.'
			                   };

			$scope.mixedBag = {'0': 'nobody thought it was funny.',
			                    'one': 'and they thought it was funny.',
			                    'other': '{{pair.attributes.chosen}} people thought it was funny.'
			                   };
			$scope.$watch('id', onIdChanged);

			function onIdChanged(newValue) {
				pairService.getPairById(newValue)
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