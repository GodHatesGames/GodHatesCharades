define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('suggestionRow', ['parseUser', 'cardService', '$rootScope', function(parseUser, cardService, $rootScope) {
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
					var promise = cardService.getCard($scope.id);
					promise.then(onSuccess, onError);

					function onSuccess(suggestion) {
						$scope.data = suggestion;
						$scope.typeClass = cardService.getTypeClass(suggestion);
					}

					function onError(error) {
						console.log('error fetching suggestion:', error);
					}
				}
			}
		}]);
	}
);