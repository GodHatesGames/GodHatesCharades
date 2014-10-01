'use strict';
var userUtils = require('cloud/v2/userUtils.js');

exports.getUnmoderatedSuggestions = _getUnmoderatedSuggestions;
exports.approveSuggestion = _approveSuggestion;
exports.disapproveSuggestion = _disapproveSuggestion;

function _getUnmoderatedSuggestions(request, response) {
	//to allow fetching owners
	Parse.Cloud.useMasterKey();
	
	// console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(fetchData, onError);
	} else {
		onError();
	}

	function fetchData(isAdmin) {
		// console.log('fetchData, isAdmin:');
		// console.log(isAdmin);
		if(isAdmin) {
			// console.log('user is admin');
			var SuggestionObject = Parse.Object.extend('Suggestion');
			var query = new Parse.Query(SuggestionObject);
			query.limit(1000);
			query.notEqualTo('rejected', true);
			query.notEqualTo('moderated', true);
			query.include('owner');
			query.find({
				success: onSuccess,
				error: onError
			});
		} else {
			console.log('user is not admin');
			onError('You need to be an admin to access this page.');
		}
	}

	function onSuccess(suggestions) {
		// console.log('getUnmoderatedSuggestions Success');
		response.success(suggestions);
	}

	function onError(error) {
		console.log('getUnmoderatedSuggestions Error');
		response.error(error);
	}

}

function _approveSuggestion(request, response) {
	// console.log('approveSuggestion');
	Parse.Cloud.useMasterKey();
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(saveData, onError);
	} else {
		onError();
	}

	function saveData(isAdmin) {
		// console.log('approveSuggestion saveData');
		if(isAdmin) {
			// console.log('user is admin');
			var suggestionId = request.params.suggestionId;
			var newText = request.params.text;

			// mock suggestion
			var SuggestionObject = Parse.Object.extend('Suggestion');
			var suggestion = new SuggestionObject();
			suggestion.id = suggestionId;
			suggestion.set('moderated', true);
			suggestion.set('rejected', false);
			suggestion.set('text', newText);
			suggestion.save({
				success: onSuccess,
				error: onError
			});
		} else {
			console.log('user is not admin');
			onError('You need to be an admin to access this method.');
		}
	}

	function onSuccess(suggestion) {
		// console.log('approveSuggestion saveData success');
		response.success(suggestion);
	}

	function onError(error) {
		console.log('approveSuggestion saveData Error');
		response.error(error);
	}

}

function _disapproveSuggestion(request, response) {
	// console.log('disapproveSuggestion');
	Parse.Cloud.useMasterKey();
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(saveData, onError);
	} else {
		onError();
	}

	function saveData(isAdmin) {
		// console.log('disapproveSuggestion saveData');
		if(isAdmin) {
			// console.log('user is admin');
			var suggestionId = request.params.suggestionId;

			// mock suggestion
			var SuggestionObject = Parse.Object.extend('Suggestion');
			var suggestion = new SuggestionObject();
			suggestion.id = suggestionId;
			suggestion.set('moderated', true);
			suggestion.set('rejected', true);
			suggestion.save({
				success: onSuccess,
				error: onError
			});
		} else {
			console.log('user is not admin');
			onError('You need to be an admin to access this method.');
		}
	}

	function onSuccess(suggestion) {
		// console.log('disapproveSuggestion saveData success');
		response.success(suggestion);
	}

	function onError(error) {
		console.log('disapproveSuggestion saveData Error');
		response.error(error);
	}

}