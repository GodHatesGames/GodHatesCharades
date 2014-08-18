app.service('leaderboard', function($q, DSCacheFactory, cardService) {
	var pairService = {
		getTop: _getTop,
	}
	// expires in 1 day
	var leaderboardCache = DSCacheFactory('leaderboard', {
		maxAge: 86400000
	});
	var Pair = Parse.Object.extend('Pair');

	function _getTop() {
		var currentCache = leaderboardCache.get('leaderboard');
		if(currentCache) {
			_.each(currentCache, function(pair, index) {
				var parsePair = new Pair(pair);
				currentCache[index] = parsePair;
			});
			return $q.when(currentCache);
		} else {
			var deferred = $q.defer();
			var options = {
				pageSize: 100,
				skipIndex: 0
			};
			var callbacks = {
				success: function _onPairsRecieved(pairs) {
					_.each(pairs, _processPairs);
					console.log('caching complete, now resolve')
					deferred.resolve(pairs);
					leaderboardCache.put('leaderboard', pairs);
				},
				error: deferred.reject
			};
			Parse.Cloud.run(CONFIG.PARSE_VERSION + 'topPairs', options, callbacks);
			return deferred.promise;
		}
	}

	function _processPairs(pair) {
		var cards = [pair.get('actor'),
		             pair.get('scenario')];
		cardService.cache(cards);
	}

	return pairService;
});