var _ = require('underscore');
var admin = require('cloud/admin.js');
var vote = require('cloud/vote.js');
var cardUtils = require('cloud/cardUtils.js');
var leaderboard = require('cloud/leaderboard.js');
var user = require('cloud/user.js');

// Admin
Parse.Cloud.define('getUnmoderatedSuggestions', admin.getUnmoderatedSuggestions);
Parse.Cloud.define('getAllSuggestions', admin.getAllSuggestions);
Parse.Cloud.define('getAllSets', admin.getAllSets);
Parse.Cloud.define('getCardsForSet', admin.getCardsForSet);
Parse.Cloud.define('addCardToSet', admin.addCardToSet);

// Profile
Parse.Cloud.define('getProfile', user.getProfile);

// Vote
Parse.Cloud.define('getRandomSuggestionPairs', vote.getRandomSuggestionPairs);
Parse.Cloud.define('skipSuggestions', vote.skipSuggestions);
Parse.Cloud.define('votePair', vote.votePair);

// Leaderboard
Parse.Cloud.define('topSubmissions', leaderboard.topSubmissions);

// Misc
Parse.Cloud.define('examples', cardUtils.examples);

// Background Jobs
Parse.Cloud.job('calculateStats', leaderboard.calculateStats);
Parse.Cloud.job('testStats', leaderboard.testStats);


Parse.Cloud.beforeSave('Suggestion', function(request, response) {
	if(request.object.isNew()) {
		request.object.set('backgroundUpdatedAt', new Date());
		request.object.set('totalVotes', 1);
		request.object.set('skipped', 0);
	}
	response.success();
});