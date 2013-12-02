var _ = require('underscore');
var userUtils = require('cloud/userUtils.js');

exports.topSubmissions = topSubmissions;
exports.kdrCount = kdrCount;

function topSubmissions(request, response) {
	// to allow fetching owners
	Parse.Cloud.useMasterKey();

	var SuggestionObject = Parse.Object.extend('Suggestion');
	var query = new Parse.Query(SuggestionObject);

	switch(request.params.type) {
		case 'controversial' :
			query.ascending('kdr');
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

function kdrCount(request, status) {
	var counter = 0;

	// Query for all suggestions
	var SuggestionObject = Parse.Object.extend('Suggestion');
	var suggestionQuery = new Parse.Query(SuggestionObject);
	suggestionQuery.equalTo('moderated', true);
	suggestionQuery.equalTo('rejected', false);
	return suggestionQuery.each(function(suggestion) {

		// Update to plan value passed in
		// user.set('plan', request.params.plan);
		if (counter % 50 === 0) {
			// Set the  job's progress status
			status.message(counter + ' suggestions processed.');
		}
		counter += 1;

		var totalVotes = suggestion.get('totalVotes');
		var totalSkips = suggestion.get('skipped');
		if(totalSkips === 0) totalSkips = 1;

		var kdr = totalVotes / totalSkips;
		suggestion.set('kdr', kdr);
		return suggestion.save({
			error: function(error) {
				console.log('error fetching suggestion:', error);
			}
		});

	}).then(function() {
		// Set the job's success status
		status.success('Migration completed successfully.', counter, 'suggestions updated.');
	}, function(error) {
		// Set the job's error status
		status.error('Uh oh, something went wrong.');
	});
}