app.service('pairService', function($q, $rootScope, cardService, DSCacheFactory, Slug) {
	var pairService = {
		getLink: _getLink,
		getSlug: _getSlug,
		getPairById: _getPairById,
		clearCache: clearCache
	}

	var pairCache = DSCacheFactory('pairs');
	var pairPromises = {};
	var Pair = Parse.Object.extend('Pair');

	function cache(pairToCache) {
		pairCache.put(pairToCache.id, pairToCache);
		cardService.cache([pairToCache.get('actor'),
		                   pairToCache.get('scenario')]);
	}

	function clearCache() {
		pairCache.removeAll();
	}

	function _getPairById(pairId) {
		if(pairPromises[pairId]) {
			return pairPromises[pairId];
		} else {
			// console.log('getPairById:', pairId);
			var returnVal;
			var currentCache = pairCache.get(pairId);
			if(currentCache) {
				var parsePair = new Pair(currentCache);
				var actorData = parsePair.get('actor');
				var scenarioData = parsePair.get('scenario');

				var actorPromise = cardService.getCard(actorData.id);
				var scenarioPromise = cardService.getCard(scenarioData.id);

				var pairPromise = $q.all([actorPromise, scenarioPromise])
				.then(function(results) {
					parsePair.attributes.actor = results[0];
					parsePair.attributes.scenario = results[1];
					return parsePair;
				});

				return pairPromise;
			} else {
				var options = {
					id: pairId
				};
				pairPromises[pairId] = Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getPairById', options)
				.then(onPairFetched);

				return pairPromises[pairId];
			}
		}
	}

	function onPairFetched(pair) {
		delete pairPromises[pair.id];
		cache(pair);
		return pair;
	}

	function _getSlug(pair) {
		var text = [pair.get('actor').get('text'),
		            pair.get('scenario').get('text')].join(' ');
		return Slug.slugify(text);
	}

	function _getLink(pair) {
		return {
			pairid: pair.id,
			slug: _getSlug(pair)
		}
	}

	return pairService;
});