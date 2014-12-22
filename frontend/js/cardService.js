app.service('cardService', function($q, $rootScope, Slug, DSCacheFactory, $urlMatcherFactory, $state, $filter) {
	var cardService = {
		cache: cache,
		clearCache: clearCache,
		getTypeDisplayByType: getTypeDisplayByType,
		getTypeClassByType: getTypeClassByType,
		getImageByType: getImageByType,
		getCard: getCard,
		getBlankCardByType: _getBlankCardByType
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

	function getTypeDisplay() {
		var type = this.get('type');
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

	function getSlug() {
		var text = this.get('text');
		return Slug.slugify(text);
	}

	function getLink() {
		return {
			cardid: this.id,
			slug: this.getSlug()
		};
	}

	function getUrl() {
		var cardState = $state.get('card').url;
		var matcher = $urlMatcherFactory.compile(cardState);
		var path = matcher.format(this.getLink());
		return [
			'http://godhatescharades.com',
			path
		].join('');
	}

	function getImageUrl() {
		var type = this.get('type');
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

	function getTotalVotes() {
		var totalVotes = this.get('totalVotes');
		return totalVotes ? totalVotes : 0;
	}

	function getTotalSkips() {
		var totalSkips = this.get('skipped');
		return totalSkips ? totalSkips : 0;
	}

	function getKDR() {
		var kills = this.getTotalVotes();
		var deaths = this.getTotalSkips();
		if(deaths === 0) {
			return 0;
		} else {
			var kdr = kills / deaths;
			return $filter('number')(kdr, 1);
		}
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
		addModelMethods(updatedItem);
		var owner = updatedItem.get('owner');
		ownerCache.put(owner.id, owner);
	}

	function addModelMethods(card) {
		// add model methods
		card.getKDR = getKDR;
		card.getTotalVotes = getTotalVotes;
		card.getTotalSkips = getTotalSkips;
		card.getTypeDisplay = getTypeDisplay;
		card.getSlug = getSlug;
		card.getLink = getLink;
		card.getUrl = getUrl;
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
				addModelMethods(parseCard);
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

	function _getBlankCardByType(type) {
		return {
			attributes: {
				type: type
			}
		};
	}

	return cardService;
});