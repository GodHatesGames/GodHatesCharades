app.service('pairService', function($q, $rootScope, Suggestion, DSCacheFactory, Slug) {
	var pairService = {
		getPairById: _getPairById,
		getPairsByCard: _getPairsByCard,
		clearCache: clearCache
	}

	var pairCache = DSCacheFactory('pairs');
	var pairPromises = {};
	var Pair = Parse.Object.extend('Pair');

	function cache(pairToCache) {
		pairCache.put(pairToCache.id, pairToCache);
		pairToCache.attributes.actor = Suggestion.inject(pairToCache.attributes.actor);
		pairToCache.attributes.scenario = Suggestion.inject(pairToCache.attributes.scenario);
	}

	function clearCache() {
		pairCache.removeAll();
	}

	function _getPairsByCard(card) {
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
				addModelMethods(parsePair);
				var actorData = parsePair.get('actor');
				var scenarioData = parsePair.get('scenario');

				var actorPromise = Suggestion.find(actorData.id);
				var scenarioPromise = Suggestion.find(scenarioData.id);

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

	function addModelMethods(pair) {
		pair.getLink = _getLink;
		pair.getSlug = _getSlug;
		pair.getViews = _getViews;
		pair.getVotes = _getVotes;
		pair.getSkips = _getSkips;
	}

	function _getViews() {
		return this.attributes.displayed || 0;
	}

	function _getVotes() {
		return this.attributes.chosen || 0;
	}

	function _getSkips() {
		return this.attributes.skipped || 0;
	}

	function onPairFetched(pair) {
		delete pairPromises[pair.id];
		cache(pair);
		return pair;
	}

	function _getSlug() {
		var text = [this.get('actor').get('text'),
		            this.get('scenario').get('text')].join(' ');
		return Slug.slugify(text);
	}

	function _getLink() {
		return {
			pairid: this.id,
			slug: this.getSlug()
		}
	}

	return pairService;
});