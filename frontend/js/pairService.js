app.service('pairService', function($q, $rootScope, cardService, DSCacheFactory) {
	var pairService = {
		getPairById: getPairById
	}

	var pairCache = DSCacheFactory('pairs');
	var Pair = Parse.Object.extend('Pair');

	function cache(pairToCache) {
		pairCache.put(pairToCache.id, pairToCache);
		cardService.cache([pairToCache.get('actor'),
		                   pairToCache.get('scenario')]);
	}


	function getPairById(pairId) {
		console.log('getPairById:', pairId);
		var returnVal;
		var currentCache = pairCache.get(pairId);
		if(currentCache) {
			var parsePair = new Pair(currentCache);
			var actorData = parsePair.get('actor');
			if(actorData.objectId) {
				var cachedActor = cardService.getCard(actorData.objectId);
				parsePair.set('actor', cachedActor);
			}
			var scenarioData = parsePair.get('scenario');
			if(scenarioData.objectId) {
				var cachedScenario = cardService.getCard(scenarioData.objectId);
				parsePair.set('scenario', cachedScenario);
			}

			return $q.when(parsePair);
		} else {
			var options = {
				id: pairId
			};
			return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getPairById', options)
			.then(function(pair) {
				cache(pair);
				return pair;
			});
		}
	}

	return pairService;
});