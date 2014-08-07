app.controller('pairView', function(pair, $scope, $state, $stateParams, $location, $window, pairService, $rootScope) {
	$scope.pair = pair;
	$scope.sharingConfig = {};

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

	$scope.sharingConfig.title = $state.current.title;


	// DISQUS
	$scope.disqus = {
		shortname: 'godhatescharades',
		id: $stateParams.pairId,
		url: 'http://godhatescharades.com' + $location.url()
	};
})