app.controller('pairView', function(pair, readyForUpload, $scope, $state, $stateParams, $location, $window, pairService, $rootScope) {
	$window.scrollTo(0, 0);
	$scope.pair = pair;
	$scope.sharingConfig = {};

	var actor = pair.get('actor');
	var scenario = pair.get('scenario');
	$scope.actorId = actor.id;
	$scope.scenarioId = scenario.id;

	//set meta title
	$state.current.title = [actor.get('text'),
	                        scenario.get('text')].join(' ');
	$scope.title = $state.current.title;

	// set meta description
	$state.current.description = ['"',
	                              $state.current.title,
	                              '" ',
	                              'is a pair of cards that might be added to God Hates Charades.'].join('');

	$scope.sharingConfig.title = $state.current.title;

	$scope.uploadTitle = ['Watch me act like "',
	                      $state.current.title,
	                      '"'].join('');
	$scope.uploadDescription = ['I just acted out a scene from God Hates Charades: The Game that makes your friends funny! I\'m acting as "',
	                            $state.current.title,
	                            '"\n\n',
	                            'Check out the game on Kickstarter right now! http://bit.ly/godhatescharades \n\n',
	                            'Vote on cards or record your own vide on http://godhatescharades.com',].join('');
	$scope.uploadKeywords = [pair.id,
	                         '"God Hates Charades"',
	                         '"Party Game"',
	                         'Acting',
	                         'Actor',
	                         'Scenario'];


	// DISQUS
	$scope.disqus = {
		shortname: 'godhatescharades',
		id: $stateParams.pairId,
		url: 'http://godhatescharades.com' + $location.url()
	};
});