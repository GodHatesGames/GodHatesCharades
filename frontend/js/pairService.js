app.service('pairService', function($q, $rootScope, cardService, DSCacheFactory, Slug) {
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
		cardService.cache([pairToCache.get('actor'),
		                   pairToCache.get('scenario')]);
	}

	function clearCache() {
		pairCache.removeAll();
	}

	function _getPairsByCard(card) {
		if(pairPromises[card.id]) {
			return pairPromises[card.id];
		} else {
			console.log('getPairsByCard:', card.id);
			var returnVal;
			var options = {
				cardid: card.id,
				cardtype: card.getTypeDisplay().toLowerCase()
			};
			pairPromises[card.id] = Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getPairsByCard', options)
			.then(_onCardPairsFetched)
			.then(_onCardsFetched);

			return pairPromises[card.id];
		}

		function _onCardPairsFetched(pairs) {
			pairs;
			// cache pairs
			_.each(pairs, cache);
			// fetch pair cards
			var pairPromises = [];
			_.each(pairs, function(pair) {
				var pairPromise = _getPairById(pair.id);
				pairPromises.push(pairPromise);
			});
			return $q.all(pairPromises);
		}

		function _onCardsFetched(pairs) {
			delete pairPromises[card.id];
			return pairs;
		}
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