var _ = require('underscore');
var userUtils = require('cloud/userUtils.js');

exports.getRandomSuggestionPairs = getRandomSuggestionPairs;
exports.skipSuggestions = skipSuggestions;
exports.votePair = votePair;

// Use Parse.Cloud.define to define as many cloud functions as you want.
function getRandomSuggestionPairs(request, response) {
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
		query.ascending('updatedAt');
		query.equalTo('moderated', true);
		query.equalTo('rejected', false);
		query.include('owner');
		query.doesNotExist('card');
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
			var zeroSuggestion = zeroSuggestions[i];
			var oneSuggestion = oneSuggestions[i];

			// remove private data
			userUtils.stripPrivateData(zeroSuggestion.attributes.owner);
			userUtils.stripPrivateData(oneSuggestion.attributes.owner);

			//save pair
			var pair = {
				0: zeroSuggestion,
				1: oneSuggestion
			}
			suggestionPairs.push(pair);
		}

		response.success(suggestionPairs);
	}

}


function votePair(request, response) {
	Parse.Cloud.useMasterKey();
	var VoteObject = Parse.Object.extend('Vote');
	var SuggestionObject = Parse.Object.extend('Suggestion');
	var saveCount = 0;

	if(request.params.chosenPair) {
		_.each(request.params.chosenPair, function(suggestionId, index, pairs) {
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
					suggestionObj.increment('totalVotes', 1);
					var relation = suggestionObj.relation('votes');
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

	if(request.params.skippedPair) {

		_.each(request.params.skippedPair, function(suggestionId, index, pairs) {
			saveCount++;
			var suggestionObj = new SuggestionObject();
			suggestionObj.id = suggestionId;
			suggestionObj.increment('skipped', 1);
			suggestionObj.save({
				success: onSuccess,
				error: onError
			})
		});
	}

	if(saveCount === 0) {
		response.error('no data sent');
	}

	function onSuccess(obj) {
		saveCount--;
		if(saveCount === 0)
			response.success('votes saved');
	}

	function onError(obj, error) {
		response.error(error);
	}
}

function skipSuggestions(request, response) {
	Parse.Cloud.useMasterKey();
	var SuggestionObject = Parse.Object.extend('Suggestion');
	var saveCount = 0;

	if(request.params.skippedIds) {

		_.each(request.params.skippedIds, function(suggestionId, index, pairs) {
			console.log('suggestionId:', suggestionId);
			saveCount++;
			var suggestionObj = new SuggestionObject();
			suggestionObj.id = suggestionId;
			suggestionObj.increment('skipped', 1);
			suggestionObj.save({
				success: onSuccess,
				error: onError
			})
		});
	}
	console.log('saveCount:', saveCount);

	if(saveCount === 0) {
		response.error('no data sent');
	}

	function onSuccess(obj) {
		saveCount--;
		if(saveCount === 0)
			response.success('votes saved');
	}

	function onError(obj, error) {
		response.error(error);
	}
}