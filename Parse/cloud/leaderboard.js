var _ = require('underscore');
var userUtils = require('cloud/userUtils.js');

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
			query.ascending('controversy');
			break;
		case 'worst' :
			// only grab if kdr has been evaluated
			query.exists('kdr');
			query.ascending('kdr,-skipped,-totalVotes');
			break;
		case 'best' :
		default :
			// only grab if kdr has been evaluated
			query.exists('kdr');
			query.descending('kdr,-totalVotes,-skipped');
			break;
	}
	// extra protection with max of 100 items
	query.limit(Math.min(request.params.pageSize, 100));
	// include owner so we can display their details
	query.include('owner');
	// only use approved suggestions
	query.equalTo('moderated', true);
	query.equalTo('rejected', false);
	query.skip(request.params.skipIndex);
	query.find({
		success: onSuggestionsLoaded,
		error: onSuggestionsError
	});

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
	console.log('kdr started');
	var counter = 0;

	// Query for all suggestions
	var SuggestionObject = Parse.Object.extend('Suggestion');
	var suggestionQuery = new Parse.Query(SuggestionObject);
	suggestionQuery.equalTo('moderated', true);
	suggestionQuery.equalTo('rejected', false);
	return suggestionQuery.each(function(suggestion) {

		// Update to plan value passed in
		// user.set('plan', request.params.plan);

		var totalVotes = suggestion.get('totalVotes');
		var totalSkips = suggestion.get('skipped');
		if(totalSkips === 0) totalSkips = 1;

		var kdr = totalVotes / totalSkips;
		suggestion.set('kdr', kdr);
		return suggestion.save({
			success: function(savedSuggestion) {
				console.log('kdr saved');
				if (counter % 50 === 0) {
					// Set the  job's progress status
					status.message('killDeathRatio: ' + counter + ' suggestions processed.');
					console.log('killDeathRatio: ' + counter + ' suggestions processed.');
				}
				counter += 1;
			},
			error: function(error) {
				console.log('error fetching suggestion:', error);
			}
		});

	}).then(function() {
		// Set the job's success status
		status.message('killDeathRatio completed successfully.', counter, 'suggestions updated.');
		console.log('killDeathRatio completed successfully.', counter, 'suggestions updated.');
	}, function(error) {
		// Set the job's error status
		status.message('error: killDeathRatio failed.');
		console.log('error: killDeathRatio failed', JSON.stringify(error));
	});
}

function controversyValue(status) {
	console.log('controversy started');

	var counter = 0;

	// Query for all suggestionPairs
	var SuggestionObject = Parse.Object.extend('Suggestion');
	var suggestionQuery = new Parse.Query(SuggestionObject);
	suggestionQuery.equalTo('moderated', true);
	suggestionQuery.equalTo('rejected', false);
	return suggestionQuery.each(function(suggestion) {
		console.log('processing suggestion:', suggestion.id);
		// Update to plan value passed in
		// user.set('plan', request.params.plan);

		var totalVotes = suggestion.get('totalVotes');
		var totalSkips = suggestion.get('skipped');
		if(totalSkips === 0) totalSkips = 1;

		var controversy = Math.abs(Math.abs(totalVotes) - Math.abs(totalSkips));
		suggestion.set('controversy', controversy);
		return suggestion.save({
			success: function(savedSuggestion) {
				if (counter % 50 === 0) {
					// Set the  job's progress status
					status.message('controversyValue: ' + counter + ' suggestions processed.');
				}
				counter += 1;
			},
			error: function(error) {
				console.log('error fetching suggestion:', error);
			}
		});

	}).then(function() {
		// Set the job's success status
		status.message('controversyValue completed successfully.', counter, 'suggestions updated.');
		console.log('controversyValue completed successfully.', counter, 'suggestions updated.');
	}, function(error) {
		// Set the job's error status
		console.log('error: controversyValue failed.');
		status.message('error: controversyValue failed.');
	});
}

function testStats(request, status) {
	var promise = controversyValue(status);
	// fin
	promise.then(function() {
		// Set the job's success status
		status.success('testStats completed successfully.');
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