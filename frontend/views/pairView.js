app.controller('pairView', function(pair, readyForUpload, $scope, $state, $stateParams, $location, $window, pairService, $rootScope) {
	$window.scrollTo(0, 0);
	$scope.pair = pair;
	$scope.sharingConfig = {};

	$scope.actor = pair.get('actor');
	$scope.scenario = pair.get('scenario');

	//set meta title
	$state.current.title = [$scope.actor.get('text'),
	                        $scope.scenario.get('text')].join(' ');
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

	$scope.playerVars = {
		listType: 'search',
		list: '%22' + $scope.title + '%22'
	};

	// DISQUS
	$scope.disqus = {
		shortname: 'godhatescharades',
		id: $stateParams.pairId,
		url: 'http://godhatescharades.com' + $location.url()
	};
});