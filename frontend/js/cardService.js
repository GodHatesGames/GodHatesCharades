app.service('cardService', function($q, $rootScope, Slug) {
	var cardService = {
		cache: cache,
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

	var cardsById = {};

	var TYPE_DISPLAY_CHARACTER = "Character";
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
		_.each(cards, function(element, index, list) {
			var currentCache = cardsById[element.id];
			if(currentCache) {
				if(element.updatedAt > currentCache.updatedAt)
					cardsById[element.id] = element;
			} else {
				cardsById[element.id] = element;
			}
		})
	}

	function getCard(cardId) {
		// console.log('getCard:', cardId);
		var returnVal;
		var currentCache = cardsById[cardId];
		if(currentCache) {
			return $q.when(currentCache);
		} else {
			var options = {
				id: cardId
			};
			return Parse.Cloud.run('getCardById', options);
		}
	}

	return cardService;
});