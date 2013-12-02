var _ = require('underscore');
var userUtils = require('cloud/userUtils.js');

exports.getProfile = getProfile;

function getProfile(request, response) {
	// to allow fetching owners
	Parse.Cloud.useMasterKey();

	var Suggestion = Parse.Object.extend('Suggestion');
	var owner = new Parse.User();
	owner.id = request.params.userid;
	var query = new Parse.Query(Suggestion);
	query.descending('totalVotes');
	query.equalTo('owner', owner);
	query.include('owner');
	query.skip(request.params.skipIndex);
	query.find({
		success: onSuggestionsLoaded,
		error: onSuggestionsError
	});

	function onSuggestionsLoaded(suggestions) {
		if(suggestions.length > 0) {
			var suggestionPairs = [];
			var suggestion;
			var owner = suggestions[0].get('owner');
			console.log(suggestions);
			console.log('owner');
			console.log(owner);
			userUtils.stripPrivateData(owner);
			for(var i = 0; i < suggestions.length; i++) {
				suggestion = suggestions[i];
				suggestion.attributes.owner = owner;
			}
		}

		response.success({
			user: owner,
			suggestions: suggestions
		});
	}

	function onSuggestionsError(error) {
		response.reject(error);
	}

}