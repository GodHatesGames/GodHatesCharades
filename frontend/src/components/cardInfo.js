define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('cardInfo', ['parseUser', 'cardService', function(parseUser, cardService) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/cardInfo.html',
				replace: true,
				scope: {
					id: '=id'
				},
				controller: function($scope, $element) {
					$scope.cardService = cardService;
					var card = cardService.getCard($scope.id);
					if(card) {
						$scope.card = card;
						$scope.totalVotes = cardService.getTotalVotes(card);
						$scope.totalSkips = cardService.getTotalSkips(card);
					}
				}
			}
		}]);
	}
);