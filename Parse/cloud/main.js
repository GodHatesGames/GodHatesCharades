var _ = require('underscore');

// Use Parse.Cloud.define to define as many cloud functions as you want.
Parse.Cloud.define('getRandomSuggestionPairs', function(request, response) {
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
		query.equalTo('approved', true);
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
			var pair = {
				0: zeroSuggestions[i],
				1: oneSuggestions[i]
			}
			suggestionPairs.push(pair);
		}

		response.success(suggestionPairs);
	}

});


Parse.Cloud.define('votePair', function(request, response) {
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
});

Parse.Cloud.define('skipSuggestions', function(request, response) {
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
});

Parse.Cloud.beforeSave('Suggestion', function(request, response) {
	if(request.object.isNew()) {
		request.object.set('backgroundUpdatedAt', new Date());
		request.object.set('totalVotes', 0);
	}
	response.success();
});

/*Parse.Cloud.job('voteCount', function(request, status) {
	// Set up to modify user data
	Parse.Cloud.useMasterKey();
	var counter = 0;
	// Query for all suggestions
	var SuggestionObject = Parse.Object.extend('Suggestion');
	var VoteObject = Parse.Object.extend('Vote');
	var suggestionQuery = new Parse.Query(SuggestionObject);
	suggestionQuery.equalTo('approved', true);
	suggestionQuery.exists('card');
	// query.include('votes');
	return suggestionQuery.each(function(suggestion) {

		var relation, promise, query;
		// Update to plan value passed in
		// user.set('plan', request.params.plan);
		if (counter % 100 === 0) {
			// Set the  job's progress status
			status.message(counter + ' votes processed.');
		}
		counter += 1;

		relation = suggestion.relation('votes');
		query = relation.query();
		query.greaterThan('updatedAt', suggestion.get('backgroundUpdatedAt'));
		promise = query.find({
			success: function(votes) {
				suggestion.increment('totalVotes', votes.length);
				promise.resolve();
			}, 
			error: function(error) {
				console.log('error fetching:', error);
				promise.resolve();
			}
		});
		return promise;
	}).then(function() {
		// Set the job's success status
		status.success('Migration completed successfully.');
	}, function(error) {
		// Set the job's error status
		status.error('Uh oh, something went wrong.');
	});
});*/
