var _ = require('underscore');

// Use Parse.Cloud.define to define as many cloud functions as you want.
Parse.Cloud.define("getRandomSuggestionPairs", function(request, response) {
	var SuggestionObject = Parse.Object.extend("Suggestion");
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
		query.ascending('updatedAt');
		if(request.params.skip)
			query.skip(request.params.skip);
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
			var pair = {
				0: zeroSuggestions[i],
				1: oneSuggestions[i]
			}
			suggestionPairs.push(pair);
		}

		response.success(suggestionPairs);
	}

});


Parse.Cloud.define("votePair", function(request, response) {
	var VoteObject = Parse.Object.extend("Vote");
	var SuggestionObject = Parse.Object.extend("Suggestion");
	var saveCount = 0;

	if(!request.params.pair) {
		response.error('must send pair');
	} else {
		_.each(request.params.pair, function(suggestionId, index, pairs) {
			saveCount++;
			var newVote = new VoteObject();
			var opposite = pairs[index == 0 ? 1 : 0];
			newVote.set('owner', Parse.User.current());
			newVote.set('parent', suggestionId);
			newVote.set('pair', opposite);
			newVote.save({
				success: function(vote) {
					var suggestionObj = new SuggestionObject();
					suggestionObj.id = suggestionId;
					var relation = suggestionObj.relation("votes");
					relation.add(vote);
					suggestionObj.save({
						success: onSuccess,
						error: onError
					})
				},
				error: onError
			});
		});
	}

	function onSuccess(obj) {
		saveCount--;
		if(saveCount === 0)
			response.success('votes saved');
	}

	function onError(obj, error) {
		response.error(error);
	}
});
