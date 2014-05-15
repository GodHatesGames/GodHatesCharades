app.controller('cardView', function($scope, $state, $stateParams, $location, $window, cardService) {
	$scope.cardid = $stateParams.cardid;

	var card = cardService.getCard($scope.cardid)
	.then(function(card) {
		//set meta title
		$state.current.title = card.get('text');

		// set meta description
		$state.current.description = ['"',
		                              card.get('text'),
		                              '" is a ',
		                              cardService.getTypeDisplay(card),
		                              ' card submitted by ',
		                              card.get('owner').get('name')].join('');
	});

	// DISQUS
	$scope.disqus = {
		shortname: 'godhatescharades',
		id: $stateParams.cardid,
		url: $location.absUrl()
	};
})