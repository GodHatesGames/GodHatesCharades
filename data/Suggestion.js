define([
	'angular'
	], 
	function(angular) {

		// reference the module we declared earlier
		var externalDataService = angular.module('ExternalDataServices');

		// add a factory
		externalDataService.factory('SuggestionService', ['ParseQueryAngular', function(ParseQueryAngular) {

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

					var suggestion = new Suggestion();
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

			var TYPE_DISPLAY_CHARACTER = "Character";
			var TYPE_DISPLAY_SCENARIO = "Scenario";
			var TYPE_CLASS_CHARACTER = "character";
			var TYPE_CLASS_SCENARIO = "scenario";
			function getTypeDisplay(type) {
				switch(type) {
					case 0 :
						return TYPE_DISPLAY_CHARACTER;
					case 1 :
						return TYPE_DISPLAY_SCENARIO;
				}
			}

			function getTypeClass(type) {
				switch(type) {
					case 0 :
						return TYPE_CLASS_CHARACTER;
					case 1 :
						return TYPE_CLASS_SCENARIO;
				}
			}

			// Return a simple API : model or collection.
			return {
				model: Suggestion,
				collection: Suggestions,
				getTypeDisplay: getTypeDisplay,
				getTypeClass: getTypeClass
			};

		}]);

	}
);