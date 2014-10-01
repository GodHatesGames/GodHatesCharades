app.service('cardService', function($q, $rootScope, Slug, DSCacheFactory) {
	var cardService = {
		cache: cache,
		clearCache: clearCache,
		getTypeDisplay: getTypeDisplay,
		getTypeDisplayByType: getTypeDisplayByType,
		getTypeClass: getTypeClass,
		getTypeClassByType: getTypeClassByType,
		getImageUrl: getImageUrl,
		getImageByType: getImageByType,
		getTotalVotes: getTotalVotes,
		getTotalSkips: getTotalSkips,
		getKDR: getKDR,
		getCard: getCard,
		getSlug: getSlug,
		getLink: getLink
	}

	// expires in 1 week
	var cardCache = DSCacheFactory('cards', {
		maxAge: 604800000
	});
	var ownerCache = DSCacheFactory('owners', {
		maxAge: 604800000
	});
	var cardPromises = {};
	var Suggestion = Parse.Object.extend('Suggestion');

	var TYPE_DISPLAY_CHARACTER = "Actor";
	var TYPE_DISPLAY_SCENARIO = "Scenario";
	var TYPE_CLASS_CHARACTER = "character";
	var TYPE_CLASS_SCENARIO = "scenario";

	function getTypeDisplay(card) {
		var type = card.get('type');
		return getTypeDisplayByType(type);
	}

	function getTypeDisplayByType(type) {
		switch(type) {
			case 0 :
				return TYPE_DISPLAY_CHARACTER;
			case 1 :
				return TYPE_DISPLAY_SCENARIO;
		}
	}

	function getTypeClass(card) {
		var type = card.get('type');
		return getTypeClassByType(type);
	}

	function getTypeClassByType(type) {
		switch(type) {
			case 0 :
				return TYPE_CLASS_CHARACTER;
			case 1 :
				return TYPE_CLASS_SCENARIO;
			default :
				console.log('unhandled card type:', type);
				break;
		}
	}

	function getSlug(card) {
		var text = card.get('text');
		return Slug.slugify(text);
	}

	function getLink(card) {
		return {
			cardid: card.id,
			slug: getSlug(card)
		}
	}

	function getImageUrl(card) {
		var type = card.get('type');
		return getImageByType(type);
	}

	function getImageByType(type) {
		switch(type) {
			case 0 :
				return 'img/actor_skull.svg';
			case 1 :
				return 'img/scenario_ball.svg';
		}
	}

	function getTotalVotes(card) {
		var totalVotes = card.get('totalVotes');
		return totalVotes ? totalVotes : 0;
	}

	function getTotalSkips(card) {
		var totalSkips = card.get('skipped');
		return totalSkips ? totalSkips : 0;
	}

	function getKDR(kills, deaths) {
		if(deaths === 0)
			return '∞';
		else
			return kills / deaths;
	}

	function cache(cards) {
		if(_.isArray(cards)) {
			_.each(cards, function(element) {
				updateCache(element);
			});
		} else {
			updateCache(cards);
		}
	}

	function updateCache(updatedItem) {
		cardCache.put(updatedItem.id, updatedItem);
		var owner = updatedItem.get('owner');
		ownerCache.put(owner.id, owner);
	}

	function clearCache() {
		cardCache.removeAll();
	}

	function getCard(cardId) {
		if(cardPromises[cardId]) {
			return cardPromises[cardId];
		} else {
			var currentCardCache = cardCache.get(cardId),
			currentOwnerCache,
			ownerId;

			if(currentCardCache) {
				// if current card cache is fufilled then check that owner is set
				ownerId = currentCardCache ? currentCardCache.owner.objectId : undefined;

				if(ownerId) {
					// if ownerId exists then get cache
					currentOwnerCache = ownerCache.get(ownerId);
				}
			}

			if(currentCardCache && currentOwnerCache) {
				// if caches were fufilled then return them
				var parseCard = new Suggestion(currentCardCache);
				var parseCardOwner = new Parse.User(currentOwnerCache);
				parseCard.attributes.owner = parseCardOwner;
				return $q.when(parseCard);
			} else {
				// else fetch data
				var options = {
					id: cardId
				};
				cardPromises[cardId] = Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getCardById', options)
				.then(onCardFetched);
				return cardPromises[cardId];
			}
		}
	}

	function onCardFetched(card) {
		delete cardPromises[card.id];
		updateCache(card);
		return card;
	}

	return cardService;
});