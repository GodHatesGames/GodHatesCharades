define([
	'app'
	], 
	function(app) {

		app.service('cardService', [function() {
			var cardService = {
				cache: cache,
				getTypeDisplay: getTypeDisplay,
				getTypeClass: getTypeClass,
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
				switch(type) {
					case 0 :
						return TYPE_DISPLAY_CHARACTER;
					case 1 :
						return TYPE_DISPLAY_SCENARIO;
				}
			};

			function getTypeClass(card) {
				var type = card.get('type');
				switch(type) {
					case 0 :
						return TYPE_CLASS_CHARACTER;
					case 1 :
						return TYPE_CLASS_SCENARIO;
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

			function getCard(cardId, successCallback, errorCallback) {
				var currentCache = cardsById[cardId];
				if(currentCache && successCallback) {
					successCallback(currentCache);
				} else if(successCallback && errorCallback){
					// console.log('TODO: Fetch card from server');
					var Suggestion = Parse.Object.extend("Suggestion");
					var query = new Parse.Query(Suggestion);
					query.get(cardId, {
						success: successCallback,
						error: errorCallback
					});
				} else {
					console.log('must provide success and error callbacks');
				}
			}

			return cardService;
		}]);
	}
);