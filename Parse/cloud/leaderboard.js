var _ = require('underscore');
var userUtils = require('cloud/userUtils.js');

exports.topSubmissionsByTotalVotes = topSubmissionsByTotalVotes;

// Use Parse.Cloud.define to define as many cloud functions as you want.
function topSubmissionsByTotalVotes(request, response) {
	// to allow fetching owners
	Parse.Cloud.useMasterKey();

	var SuggestionObject = Parse.Object.extend('Suggestion');
	var query = new Parse.Query(SuggestionObject);
	query.descending('totalVotes');
	// extra protection with max of 100 items
	query.limit(Math.min(request.params.pageSize, 100));
	query.include('owner');
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

// function topSubmissions