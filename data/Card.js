define([
	'angular'
	], 
	function(angular) {

		// reference the module we declared earlier
		angular.module('ExternalDataServices')

		// add a factory
		.factory('CardService', ['ParseQueryAngular', function(ParseQueryAngular) {

			var Card = Parse.Object.extendAngular({
				className:"Card",
				setText: function(text) {
					this.set('text',text);
					return this;
				},
				setType: function(type) {
					this.set('type',type);
					return this;
				},
				parseDestroy:function(){
					return ParseQueryAngular(this,{functionToCall:"destroy"});
				}
			});

			var Cards = Parse.Collection.extendAngular({
				model: Card,
				comparator: function(model) {
					return -model.createdAt.getTime();
				},
				addCard: function() {
			 		// save request_id to Parse
			 		var _this = this;

					var card = new Card;

					// use the extended Parse SDK to perform a save and return the promised object back into the Angular world
					return card.saveParse().then(function(data){
						_this.add(data);
					})
			 	},
			 	removeCard:function(card) {
			 		if (!this.get(card)) return false;
			 		var _this = this;
			 		return card.destroyParse().then(function(){
			 			_this.remove(card);
			 		});
			 	}
			});

			// Return a simple API : model or collection.
			return {
				model: Card,
				collection: Cards
			};

		}]);
	}
);