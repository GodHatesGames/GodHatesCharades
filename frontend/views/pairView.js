app.controller('pairView', function($scope, $state, $stateParams, $location, $window, pairService, $rootScope) {
	$scope.pairId = $stateParams.pairid;

	var card = pairService.getPairById($scope.pairId)
	.then(function(pair) {
		$scope.pair = pair;
		var actor = pair.get('actor');
		var scenario = pair.get('scenario');
		$scope.actorId = actor.id;
		$scope.scenarioId = scenario.id;

		//set meta title
		$state.current.title = [actor.get('text'),
		                        scenario.get('text')].join(' ');

		// set meta description
		$state.current.description = ['"',
		                              $state.current.title,
		                              '" ',
		                              'is a pair of cards that might be added to God Hates Charades.'].join('');


		if(!$rootScope.$$phase)
			$scope.$digest();
	});

	// DISQUS
	$scope.disqus = {
		shortname: 'godhatescharades',
		id: $stateParams.pairId,
		url: 'http://godhatescharades.com' + $location.url()
	};
})