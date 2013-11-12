define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('suggestionRow', ['parseUser', 'cardService', '$rootScope', '$q', function(parseUser, cardService, $rootScope, $q) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/suggestionRow.html',
				replace: true,
				scope: {
					id: '=id'
				},
				controller: function($scope, $element) {
					$scope.typeClass = "";
					$scope.data;
					var cachedData = ;
					// console.log('cachedData:', cachedData);
					var promise = cardService.getCard($scope.id);
					// console.log('promise:', promise);
					promise.then(onSuccess, onError);

					function onSuccess(suggestion) {
						console.log('successs');
						$scope.data = suggestion;
						$scope.typeClass = cardService.getTypeClass(suggestion);
						if(!$rootScope.$$phase)
							$scope.$digest();
					}

					function onError(error) {
						console.log('error fetching suggestion:', error);
					}
				}
			}
		}]);
	}
);