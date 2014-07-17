var _ = require('underscore');
var userUtils = require('cloud/v2/userUtils.js');
var MAX_FETCH = 100;

exports.topSubmissions = topSubmissions;
exports.calculateStats = calculateStats;
exports.testStats = testStats;

function topSubmissions(request, response) {
	// to allow fetching owners
	Parse.Cloud.useMasterKey();

	var SuggestionObject = Parse.Object.extend('Suggestion');
	var query = new Parse.Query(SuggestionObject);

	switch(request.params.type) {
		case 'controversial' :
			query.exists('controversy');
			query.ascending('controversy,-skipped,-totalVotes');
			query.greaterThan('totalVotes', 50);
			break;
		case 'worst' :
			// only grab if kdr has been evaluated
			query.exists('kdr');
			query.ascending('kdr,-skipped,totalVotes');
			query.greaterThan('skipped', 100);
			break;
		case 'best' :
		default :
			// only grab if kdr has been evaluated
			query.exists('kdr');
			query.descending('kdr,-totalVotes,-skipped');
			query.greaterThan('totalVotes', 100);
			break;
	}
	// extra protection with max of 100 items
	var itemsRemaining = MAX_FETCH - request.params.skipIndex;
	if(itemsRemaining <= 0) {
		response.success([]);
	} else {
		var pageSize = Math.min(request.params.pageSize, itemsRemaining);
		var skipIndex = request.params.skipIndex;
		query.limit(pageSize);
		query.skip(skipIndex);
		// include owner so we can display their details
		query.include('owner');
		// only use approved suggestions
		query.equalTo('moderated', true);
		query.equalTo('rejected', false);
		// only use suggestions that have been seen a lot
		query.find({
			success: onSuggestionsLoaded,
			error: onSuggestionsError
		});
	}

	function onSuggestionsLoaded(suggestions) {
		var suggestionPairs = [];
		var suggestion;
		for(var i = 0; i < suggestions.length; i++) {
			suggestion = suggestions[i];
			userUtils.stripPrivateData(suggestion.attributes.owner);
		}

		response.success(suggestions);
	}

	function onSuggestionsError(error) {
		response.reject(error);
	}
}

function killDeathRatio(status) {
	// to allow fetching owners
	Parse.Cloud.useMasterKey();

	console.log('kdr started');
	var promises = [];
	var counter = 0;
	var limit = 300;

	// Query for all suggestions
	var PairObject = Parse.Object.extend('Pair');
	var query = new Parse.Query(PairObject);
	query.descending('displayed');
	query.limit(limit);
	return query.find()
	.then(function(pairs) {
		console.log(pairs.length + ' found');
		_.each(pairs, function(pair) {
			// Update to plan value passed in
			// user.set('plan', request.params.plan);

			var chosen = pair.get('chosen');
			if(!chosen) chosen = 1;
			var skipped = pair.get('skipped');
			if(!skipped) skipped = 1;

			var kdr = chosen / skipped;
			pair.set('kdr', kdr);
			var savePromise = pair.save(null, {
				success: function(savedPair) {
					// console.log('kdr saved');
					if (counter % 10 === 0) {
						// Set the  job's progress status
						status.message('killDeathRatio: ' + counter + ' pairs processed.');
						console.log('killDeathRatio: ' + counter + ' pairs processed.');
					}
					counter += 1;
					if(counter === limit)
						finishedSavingKdr();
				},
				error: function(error) {
					console.log('error fetching pair:', error);
					errorSavingKdr(error);
				}
			});
			promises.push(savePromise);
		});
		return Parse.Promise.when(promises)
		.then(finishedSavingKdr, errorSavingKdr);
	});


	function finishedSavingKdr() {
		// Set the job's success status
		status.message('killDeathRatio completed successfully. ' + counter + 'pairs updated.');
		console.log('killDeathRatio completed successfully. ' + counter + 'pairs updated.');
		promise.resolve();
	}

	function errorSavingKdr(error) {
		// Set the job's error status
		status.message('error: killDeathRatio failed.');
		console.log('error: killDeathRatio failed' + JSON.stringify(error));
	}
}

function controversyValue(status) {
	// to allow fetching owners
	Parse.Cloud.useMasterKey();

	console.log('controversy started');

	var counter = 0;

	// Query for all suggestionPairs
	var SuggestionObject = Parse.Object.extend('Suggestion');
	var suggestionQuery = new Parse.Query(SuggestionObject);
	suggestionQuery.equalTo('moderated', true);
	suggestionQuery.equalTo('rejected', false);
	return suggestionQuery.each(function(suggestion) {
		// console.log('processing suggestion:', suggestion.id);
		// Update to plan value passed in
		// user.set('plan', request.params.plan);

		var totalVotes = suggestion.get('totalVotes');
		var totalSkips = suggestion.get('skipped');
		if(totalSkips === 0) totalSkips = 1;

		var controversy = Math.abs(Math.abs(totalVotes) - Math.abs(totalSkips));
		suggestion.set('controversy', controversy);
		return suggestion.save(null, {
			success: function(savedSuggestion) {
				if (counter % 50 === 0) {
					// Set the  job's progress status
					var message = 'controversyValue: ' + counter + ' suggestions processed.';
					console.log(message);
					status.message(message);
				}
				counter += 1;
			},
			error: function(error) {
				console.log('error fetching suggestion:', error);
			}
		});

	}).then(function() {
		// Set the job's success status
		var message = 'controversyValue completed successfully.' + counter + 'suggestions updated.';
		console.log(message);
		status.message(message);
		return message;
	}, function(error) {
		// Set the job's error status
		var message = 'error: controversyValue failed. ' + JSON.stringify(error);
		console.log(message);
		status.message(message);
	});
}

function testStats(request, status) {
	var promise = killDeathRatio(status);
	// fin
	promise.then(function(results) {
		// Set the job's success status
		status.success('testStats completed successfully.' + results);
	}, function(error) {
		// Set the job's error status
		status.error('testStats failed:' + JSON.stringify(error));
	});
}

function calculateStats(request, status) {

	var promise = Parse.Promise.when([
		killDeathRatio(status),
		controversyValue(status),
	]);

	// fin
	promise.then(function() {
		// Set the job's success status
		status.success('calculateStats completed successfully.');
	}, function(error) {
		// Set the job's error status
		status.error('calculateStats failed.');
	});
}