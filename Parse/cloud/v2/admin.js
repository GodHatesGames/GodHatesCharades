'use strict';
var userUtils = require('cloud/v2/userUtils.js');
var _ = require('underscore');

exports.getAllSuggestions = getAllSuggestions;
exports.getAllSets = getAllSets;
exports.addCardToSet = addCardToSet;
exports.removeSetItem = removeSetItem;
exports.createSet = createSet;
exports.destroySet = destroySet;
exports.updateSuggestionText = updateSuggestionText;

function getAllSuggestions(request, response) {
	//to allow fetching owners
	Parse.Cloud.useMasterKey();

	// console.log('getAllSuggestions');
	var queryLimit = 1000;
	var allSuggestions = [];
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
			console.log('user is admin');
			var SuggestionObject = Parse.Object.extend('Suggestion');
			var query = new Parse.Query(SuggestionObject);
			query.limit(queryLimit);
			query.equalTo('rejected', false);
			query.equalTo('moderated', true);
			query.include('owner');
			query.ascending('type');
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
		if(suggestions.length > 0)
			allSuggestions = allSuggestions.concat(suggestions);


		if(suggestions.length < queryLimit) {
			// console.log('found suggetions: ' + allSuggestions.length);

			_.each(allSuggestions, function(suggestion) {
			    userUtils.stripPrivateData(suggestion.attributes.owner);
			});
			response.success(allSuggestions);
		} else {
			// console.log('fetching more suggestions');
			fetchData(true, allSuggestions.length);
		}
	}

	function onError(error) {
		console.log('getAllSuggestions Error');
		response.error(error);
	}

}

function getAllSets(request, response) {
	var allSets = [];
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
			var SetObject = Parse.Object.extend('Set');
			var query = new Parse.Query(SetObject);
			query.find({
				success: onSuccess,
				error: onError
			});
		} else {
			console.log('user is not admin');
			onError('You need to be an admin to access this page.');
		}
	}

	function onSuccess(sets) {
		if(sets.length > 0)
			allSets = allSets.concat(sets);
		response.success(allSets);
	}

	function onError(error) {
		console.log('getAllSets Error');
		response.error(error);
	}

}

function addCardToSet(request, response) {
	console.log('addCardToSet');
	Parse.Cloud.useMasterKey();
	var cardId = request.params.card;
	var setId = request.params.set;
	// console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(saveData, onError);
	} else {
		onError();
	}

	function saveData(isAdmin) {
		// console.log('addCardToSet saveData');
		if(isAdmin) {
			// console.log('user is admin');
			// mock suggestion
			var SuggestionObject = Parse.Object.extend('Suggestion');
			var suggestion = new SuggestionObject();
			suggestion.id = cardId;
			// mock set
			var SetObject = Parse.Object.extend('Set');
			var set = new SetObject();
			set.id = setId;
			// create new setitem and add setitem to set
			var SetItemObject = Parse.Object.extend('SetItem');
			var newSetItem = new SetItemObject();
			newSetItem.set('card', suggestion);
			newSetItem.set('owner', set);
			newSetItem.save({
				success: onSuccess,
				error: onError
			});
		} else {
			console.log('user is not admin');
			onError('You need to be an admin to access this page.');
		}
	}

	function onSuccess(setItem) {
		// console.log('addCardToSet saveData success');
		response.success(setItem);
	}

	function onError(error) {
		console.log('addCardToSet saveData Error');
		response.error(error);
	}

}

function removeSetItem(request, response) {
	// console.log('removeSetItem');
	Parse.Cloud.useMasterKey();
	// console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(destroyItem, onError);
	} else {
		onError();
	}

	function destroyItem(isAdmin) {
		// console.log('removeSetItem destroyItem');
		if(isAdmin) {
			// console.log('user is admin');
			// create new setitem and add setitem to set
			var SetItemObject = Parse.Object.extend('SetItem');
			var itemToDelete = new SetItemObject();
			itemToDelete.id = request.params.id;
			itemToDelete.destroy({
				success: onSuccess,
				error: onError
			});
		} else {
			console.log('user is not admin');
			onError('You need to be an admin to access this page.');
		}
	}

	function onSuccess(setItem) {
		// console.log('removeSetItem destroyItem success');
		response.success(setItem);
	}

	function onError(error) {
		console.log('removeSetItem destroyItem Error');
		response.error(error);
	}

}

function createSet(request, response) {
	// console.log('createSet');
	Parse.Cloud.useMasterKey();
	// console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(createNewSet, onError);
	} else {
		onError();
	}

	function createNewSet(isAdmin) {
		// console.log('createSet createNewSet');
		if(isAdmin) {
			// console.log('user is admin');
			var Set = Parse.Object.extend('Set');
			var newSet = new Set();
			newSet.save({
				name: request.params.name
			}, {
				success: onSuccess,
				error: onError
			});
		} else {
			console.log('user is not admin');
			onError('You need to be an admin to access this page.');
		}
	}

	function onSuccess(newSet) {
		// console.log('createSet createNewSet success');
		response.success(newSet);
	}

	function onError(error) {
		console.log('createSet createNewSet Error');
		response.error(error);
	}

}

function destroySet(request, response) {
	console.log('destroySet');
	Parse.Cloud.useMasterKey();
	console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(destroyItem, onError);
	} else {
		onError();
	}

	function destroyItem(isAdmin) {
		console.log('destroySet destroyItem');
		if(isAdmin) {
			console.log('user is admin');
			// create new setitem and add setitem to set
			var SetObject = Parse.Object.extend('Set');
			var setToDelete = new SetObject();
			setToDelete.id = request.params.id;
			setToDelete.destroy({
				success: onSuccess,
				error: onError
			});
		} else {
			console.log('user is not admin');
			onError('You need to be an admin to access this page.');
		}
	}

	function onSuccess(setItem) {
		// console.log('destroySet destroyItem success');
		response.success(setItem);
	}

	function onError(error) {
		console.log('destroySet destroyItem Error');
		response.error(error);
	}

}

function updateSuggestionText(request, response) {
	// console.log('updateSuggestionText');
	Parse.Cloud.useMasterKey();
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(saveData, onError);
	} else {
		onError();
	}

	function saveData(isAdmin) {
		// console.log('updateSuggestionText saveData');
		if(isAdmin) {
			// console.log('user is admin');
			var suggestionId = request.params.suggestionId;
			// mock suggestion
			var SuggestionObject = Parse.Object.extend('Suggestion');
			var suggestion = new SuggestionObject();
			suggestion.id = suggestionId;
			suggestion.set('text', request.params.text);
			if(request.params.legal) {
				suggestion.set('legal', request.params.legal);
			}
			suggestion.save({
				success: onSuccess,
				error: onError
			});
		} else {
			console.log('user is not admin');
			onError('You need to be an admin to access this page.');
		}
	}

	function onSuccess(suggestion) {
		// console.log('updateSuggestionText saveData success');
		response.success(suggestion);
	}

	function onError(error) {
		console.log('updateSuggestionText saveData Error');
		response.error(error);
	}

}