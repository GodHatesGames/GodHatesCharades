var _ = require('underscore');
var userUtils = require('cloud/v2/userUtils.js');

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
	query.limit(request.params.pageSize);
	query.skip(request.params.skipIndex);
	query.find({
		success: onSuggestionsLoaded,
		error: onSuggestionsError
	});

	function onSuggestionsLoaded(suggestions) {
		var profile = {};
		if(suggestions.length > 0) {
			var suggestion;
			profile.owner = suggestions[0].get('owner');
			// console.log(suggestions);
			// console.log('owner');
			// console.log(owner);
			userUtils.stripPrivateData(owner);
			for(var i = 0; i < suggestions.length; i++) {
				suggestion = suggestions[i];
				suggestion.attributes.owner = owner;
			}
		}

		profile.suggestions = suggestions;

		response.success(profile);
	}

	function onSuggestionsError(error) {
		response.reject(error);
	}

}