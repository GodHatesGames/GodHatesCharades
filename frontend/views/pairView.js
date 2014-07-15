app.controller('pairView', function($scope, $state, $stateParams, $location, $window, pairService) {
	$scope.pairId = $stateParams.pairid;

	var card = pairService.getPairById($scope.pairId)
	.then(function(pair) {
		$scope.actor = pair.get('actor');
		$scope.scenario = pair.get('scenario');

		//set meta title
		$state.current.title = [$scope.actor.get('text'),
		                        $scope.scenario.get('scenario')].join(' ');

		// set meta description
		$state.current.description = ['this is a pair'].join('');
	});

	// DISQUS
	$scope.disqus = {
		shortname: 'godhatescharades',
		id: $stateParams.pairId,
		url: 'http://godhatescharades.com' + $location.url()
	};
})