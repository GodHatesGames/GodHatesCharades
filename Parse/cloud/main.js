var _ = require('underscore');
var admin = require('cloud/admin.js');
var vote = require('cloud/vote.js');

// Admin
Parse.Cloud.define('getUnmoderatedSuggestions', admin.getUnmoderatedSuggestions);

// Vote
Parse.Cloud.define('getRandomSuggestionPairs', vote.getRandomSuggestionPairs);
Parse.Cloud.define('skipSuggestions', vote.skipSuggestions);
Parse.Cloud.define('votePair', vote.votePair);

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
