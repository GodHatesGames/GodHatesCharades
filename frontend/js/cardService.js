app.service('cardService', function($q, $rootScope) {
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
		getCard: getCard
	}

	var cardsById = {};

	var TYPE_DISPLAY_CHARACTER = "Character";
	var TYPE_DISPLAY_SCENARIO = "Scenario";
	var TYPE_CLASS_CHARACTER = "character";
	var TYPE_CLASS_SCENARIO = "scenario";

	function getTypeDisplay(card) {
		var type = card.get('type');
		return getTypeDisplayByType(type);
	};

	function getTypeDisplayByType(type) {
		switch(type) {
			case 0 :
				return TYPE_DISPLAY_CHARACTER;
			case 1 :
				return TYPE_DISPLAY_SCENARIO;
		}
	};

	function getTypeClass(card) {
		var type = card.get('type');
		return getTypeClassByType(type);
	};

	function getTypeClassByType(type) {
		switch(type) {
			case 0 :
				return TYPE_CLASS_CHARACTER;
			case 1 :
				return TYPE_CLASS_SCENARIO;
		}
	};

	function getImageUrl(card) {
		var type = card.get('type');
		return getImageByType(type);
	};

	function getImageByType(type) {
		switch(type) {
			case 0 :
				return 'img/actor_skull.svg';
			case 1 :
				return 'img/scenario_ball.svg';
		}
	};

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
		console.log('getCard:', cardId);
		var returnVal;
		var currentCache = cardsById[cardId];
		if(currentCache) {
			return $q.when(currentCache);
		} else {
			var defer = $q.defer();
			// console.log('TODO: Fetch card from server');
			var Suggestion = Parse.Object.extend("Suggestion");
			var query = new Parse.Query(Suggestion);
			// query.include("owner");
			var promise = query.get(cardId);
			promise.then(function(card) {
				defer.resolve(card);
				$rootScope.$digest();
			})
			return defer.promise;
		}
	}

	return cardService;
});