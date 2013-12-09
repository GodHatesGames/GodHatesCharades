var _ = require('underscore');
var userUtils = require('cloud/userUtils.js');

exports.examples = examples;

// Use Parse.Cloud.define to define as many cloud functions as you want.
function examples(request, response) {
	Parse.Cloud.useMasterKey();
	var SuggestionObject = Parse.Object.extend('Suggestion');
	var SUGGESTION_COUNT = 25;
	var zeroSuggestions = [];
	var zeroLoaded = false;
	var oneSuggestions = [];
	var oneLoaded = false;
	loadSuggestionSet(0);
	loadSuggestionSet(1);

	function loadSuggestionSet(type) {
		var query = new Parse.Query(SuggestionObject);
		query.limit(SUGGESTION_COUNT);
		query.equalTo('type', type);
		query.equalTo('moderated', true);
		query.equalTo('rejected', false);
		// only grab if kdr has been evaluated
		query.exists('kdr');
		query.descending('kdr,-totalVotes,-skipped');
		query.include('owner');
		query.doesNotExist('card');
		query.find({
			success: function onSuggestionSetLoaded(suggestionSet) {
				switch(type) {
					case 0 :
						zeroSuggestions = suggestionSet;
						zeroLoaded = true;
						break;
					case 1 :
						oneSuggestions = suggestionSet;
						oneLoaded = true;
						break;
				}
				if(zeroLoaded && oneLoaded)
					onSuggestionsLoaded();
			}
		});
	}

	function onSuggestionsLoaded() {
		var suggestionPairs = [];
		for(var i = 0; i < SUGGESTION_COUNT; i++) {
			var zeroSuggestion = zeroSuggestions[i];
			var oneSuggestion = oneSuggestions[i];

			// remove private data
			userUtils.stripPrivateData(zeroSuggestion.attributes.owner);
			userUtils.stripPrivateData(oneSuggestion.attributes.owner);

			//save pair
			// var pair = {
			// 	0: zeroSuggestion,
			// 	1: oneSuggestion
			// }
			// suggestionPairs.push(pair);
		}

		response.success({
			zero: zeroSuggestions,
			one: oneSuggestions
		});
	}

}