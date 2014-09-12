var _ = require('underscore');
var userUtils = require('cloud/v2/userUtils.js');

exports.getProfile = getProfile;

function getProfile(request, response) {
	// to allow fetching owners
	Parse.Cloud.useMasterKey();

	var Suggestion = Parse.Object.extend('Suggestion');
	var owner = new Parse.User();
	owner.set('id', request.params.userid);
	owner.fetch({
		success: onUserLoaded,
		error: onProfileError
	});

	function onUserLoaded(user) {
		owner = user;

		var query = new Parse.Query(Suggestion);
		query.descending('totalVotes');
		query.equalTo('owner', owner);
		query.include('owner');
		query.limit(request.params.pageSize);
		query.skip(request.params.skipIndex);
		query.find({
			success: onSuggestionsLoaded,
			error: onProfileError
		});

	}
	function onSuggestionsLoaded(suggestions) {
		var profile = {
			owner: owner
		};
		if(suggestions.length > 0) {
			var suggestion;
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

	function onProfileError(error) {
		response.reject(error);
	}

}