var _ = require('lodash');
var userUtils = require('./userUtils.js');

exports.getProfile = getProfile;

function getProfile(request, response) {
	// to allow fetching owners
	//Parse.Cloud.useMasterKey();

	var Suggestion = Parse.Object.extend('Suggestion');
	var owner = new Parse.User();
	owner.set('id', request.params.userid);
	owner.fetch({
		success: onUserLoaded,
		error: onProfileError
	});

	function onUserLoaded(user) {
		userUtils.stripPrivateData(user);
		owner = user;

		var query = new Parse.Query(Suggestion);
		query.descending('totalVotes');
		query.equalTo('owner', owner);
		query.limit(request.params.pageSize);
		query.skip(request.params.skipIndex);
		query.find({
			success: onSuggestionsLoaded,
			error: onProfileError
		});
	}

	function onSuggestionsLoaded(suggestions) {
		console.log('owner');
		console.log(owner);
		var profile = {
			id: owner.id + '_profile',
			owner: owner
		};

		profile.suggestions = suggestions;

		response.success(profile);
	}

	function onProfileError(error) {
		response.reject(error);
	}

}