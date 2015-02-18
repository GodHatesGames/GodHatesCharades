'use strict';
// var _ = require('underscore');
var admin = require('cloud/admin.js');
var vote = require('cloud/vote.js');
var cardUtils = require('cloud/cardUtils.js');
var leaderboard = require('cloud/leaderboard.js');
var user = require('cloud/user.js');
var pair = require('cloud/pair.js');
var config = require('cloud/config.js');

// Admin
Parse.Cloud.define('getUnmoderatedSuggestions', admin.getUnmoderatedSuggestions);
Parse.Cloud.define('getAllSuggestions', admin.getAllSuggestions);
Parse.Cloud.define('getAllSets', admin.getAllSets);
Parse.Cloud.define('addCardToSet', admin.addCardToSet);
Parse.Cloud.define('removeSetItem', admin.removeSetItem);
Parse.Cloud.define('createSet', admin.createSet);
Parse.Cloud.define('updateSuggestionText', admin.updateSuggestionText);
Parse.Cloud.define('getCard', admin.getCard);

// Profile
Parse.Cloud.define('getProfile', user.getProfile);

// Vote
Parse.Cloud.define('getRandomSuggestionPairs', vote.getRandomSuggestionPairs);
Parse.Cloud.define('skipSuggestions', vote.skipSuggestions);

// Leaderboard
Parse.Cloud.define('topSubmissions', leaderboard.topSubmissions);

// Pair
Parse.Cloud.define('recordChosenAndSkipped', pair.recordChosenAndSkipped);
Parse.Cloud.define('recordGuessed', pair.recordGuessed);
Parse.Cloud.define('recordStumped', pair.recordStumped);

// Card Utils
Parse.Cloud.define('examples', cardUtils.examples);
Parse.Cloud.define('getCardsForSet', cardUtils.getCardsForSet);
Parse.Cloud.define('getCardById', cardUtils.getCardById);

// Background Jobs
Parse.Cloud.job('calculateStats', leaderboard.calculateStats);
Parse.Cloud.job('testStats', leaderboard.testStats);


// V2 Code

var v2 = {};
v2.admin = require('cloud/v2/admin.js');
v2.vote = require('cloud/v2/vote.js');
v2.cardUtils = require('cloud/v2/cardUtils.js');
v2.userUtils = require('cloud/v2/userUtils.js');
v2.leaderboard = require('cloud/v2/leaderboard.js');
v2.user = require('cloud/v2/user.js');
v2.pair = require('cloud/v2/pair.js');
v2.backer = require('cloud/v2/backer.js');
v2.moderation = require('cloud/v2/moderation.js');

// Moderation
Parse.Cloud.define('v2_getUnmoderatedSuggestions', v2.moderation.getUnmoderatedSuggestions);
Parse.Cloud.define('v2_approveSuggestion', v2.moderation.approveSuggestion);
Parse.Cloud.define('v2_disapproveSuggestion', v2.moderation.disapproveSuggestion);

// Admin
Parse.Cloud.define('v2_getAllSuggestions', v2.admin.getAllSuggestions);
Parse.Cloud.define('v2_getAllSets', v2.admin.getAllSets);
Parse.Cloud.define('v2_addCardToSet', v2.admin.addCardToSet);
Parse.Cloud.define('v2_removeSetItem', v2.admin.removeSetItem);
Parse.Cloud.define('v2_createSet', v2.admin.createSet);
Parse.Cloud.define('v2_destroySet', v2.admin.destroySet);
Parse.Cloud.define('v2_updateSuggestionText', v2.admin.updateSuggestionText);

// Profile
Parse.Cloud.define('v2_getProfile', v2.user.getProfile);

// Vote
Parse.Cloud.define('v2_getRandomSuggestionPairs', v2.vote.getRandomSuggestionPairs);
Parse.Cloud.define('v2_skipSuggestions', v2.vote.skipSuggestions);

// Leaderboard
Parse.Cloud.define('v2_topPairs', v2.leaderboard.topPairs);

// Pair
Parse.Cloud.define('v2_recordChosenAndSkipped', v2.pair.recordChosenAndSkipped);
Parse.Cloud.define('v2_recordGuessed', v2.pair.recordGuessed);
Parse.Cloud.define('v2_recordStumped', v2.pair.recordStumped);
Parse.Cloud.define('v2_getPairById', v2.pair.getPairById);
Parse.Cloud.define('v2_getPairsByCard', v2.pair.getPairsByCard);

// Card Utils
Parse.Cloud.define('v2_examples', v2.cardUtils.examples);
Parse.Cloud.define('v2_getCardsForSet', v2.cardUtils.getCardsForSet);
Parse.Cloud.define('v2_getCardById', v2.cardUtils.getCardById);
Parse.Cloud.define('v2_getCardsForSuggestion', v2.cardUtils.getCardsForSuggestion);

// Background Jobs
Parse.Cloud.job('v2_calculateStats', v2.leaderboard.calculateStats);

// Before Saves
Parse.Cloud.beforeSave('Suggestion', function(request, response) {
	var isNewObject = request.object.isNew();
	if(isNewObject) {
		// console.log('new suggestion, checking it out');
		var betaUser;
		if(request.user) {
			betaUser = v2.userUtils.isUserBeta(request.user.id);
		}
		if(betaUser) {
			request.object.set('backgroundUpdatedAt', new Date());
			request.object.set('totalVotes', 1);
			request.object.set('skipped', 0);
		} else {
			response.error('You must be a beta user to submit cards.');
			return;
		}
	}

	response.success();
});

Parse.Cloud.beforeSave('_User', function(request, response) {
	if(request.object.isNew()) {
		console.log('creating user with email', request.object.get('email'));
		v2.backer.getBackerByEmail(request.object.get('email'))
		.then(onBackerChecked, response.success)
		.then(checkSubscription)
		.then(response.success, response.success);
	} else {
		response.success();
	}

	function onBackerChecked(isBacker) {
		if(isBacker) {
			request.object.set('beta', true);
		}
	}

	function checkSubscription() {
		console.log('config.MAILCHIMP_API_KEY:' + config.MAILCHIMP_API_KEY);
		var emails = [
			{
				email: request.object.get('email')
			}
		];
		return Parse.Cloud.httpRequest({
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			url: config.MAILCHIMP_API_URL + 'lists/member-info',
			body: {
				apikey: config.MAILCHIMP_API_KEY,
				id: config.MAILCHIMP_LIST_ID,
				emails: emails
			}
		})
		.then(function(httpResponse) {
			// console.log('checkSubscription success');
			// console.log('subscribers with this email ' + JSON.stringify(httpResponse.data.data));
			if(httpResponse.data.data.length > 0)
				request.object.set('subscriber', true);
		},
		function(httpResponse) {
			console.log('checkSubscription fail');
			// console.error('Request failed with response code ' + httpResponse.status);
			console.error(httpResponse.data.error);
		});
	}
});