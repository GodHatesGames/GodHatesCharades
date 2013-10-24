define([
	'angular'
	], 
	function(angular) {

		// reference the module we declared earlier
		angular.module('ExternalDataServices')

		// add a factory
		.factory('SuggestionService', ['ParseQueryAngular', function(ParseQueryAngular) {

			var Suggestion = Parse.Object.extendAngular({
				className:"Suggestion",
				setText: function(text) {
					this.set('text',text);
					return this;
				},
				setType: function(type) {
					this.set('type',type);
					return this;
				},
				setOwner: function(owner) {
					this.set('owner',owner);
					return this;
				},
				parseDestroy:function(){
					return ParseQueryAngular(this,{functionToCall:"destroy"});
				}
			});

			var Suggestions = Parse.Collection.extendAngular({
				model: Suggestion,
				comparator: function(model) {
					return -model.createdAt.getTime();
				},
				addSuggestion: function(text, type, owner) {
			 		// save request_id to Parse
			 		var _this = this;

					var suggestion = new Suggestion;
					suggestion.setText(text);
					suggestion.setType(type);
					suggestion.setOwner(owner);

					// use the extended Parse SDK to perform a save and return the promised object back into the Angular world
					return suggestion.saveParse().then(function(data){
						_this.add(data);
					})
			 	},
			 	removeSuggestion:function(suggestion) {
			 		if (!this.get(suggestion)) return false;
			 		var _this = this;
			 		return suggestion.destroyParse().then(function(){
			 			_this.remove(suggestion);
			 		});
			 	}
			});

			// Return a simple API : model or collection.
			return {
				model: Suggestion,
				collection: Suggestions
			};

		}]);
	}
);