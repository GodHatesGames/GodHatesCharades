'use strict';
var userUtils = require('cloud/userUtils.js');

exports.getUnmoderatedSuggestions = getUnmoderatedSuggestions;
exports.getAllSuggestions = getAllSuggestions;
exports.getAllSets = getAllSets;
exports.getCardsForSet = getCardsForSet;
exports.addCardToSet = addCardToSet;
exports.removeSetItem = removeSetItem;

function getUnmoderatedSuggestions(request, response) {
	console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(fetchData, onError);
	} else {
		onError();
	}

	function fetchData(isAdmin) {
		console.log('fetchData, isAdmin:');
		console.log(isAdmin);
		if(isAdmin) {
			console.log('user is admin');
			var SuggestionObject = Parse.Object.extend('Suggestion');
			var query = new Parse.Query(SuggestionObject);
			query.limit(1000);
			query.notEqualTo('rejected', true);
			query.notEqualTo('moderated', true);
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
		console.log('getUnmoderatedSuggestions Success');
		response.success(suggestions);
	}

	function onError(error) {
		console.log('getUnmoderatedSuggestions Error');
		response.error(error);
	}

}

function getAllSuggestions(request, response) {
	console.log('getAllSuggestions');
	var queryLimit = 1000;
	var allSuggestions = [];
	console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(fetchData, onError);
	} else {
		onError();
	}

	function fetchData(isAdmin) {
		console.log('fetchData, isAdmin:');
		console.log(isAdmin);
		if(isAdmin) {
			console.log('user is admin');
			var SuggestionObject = Parse.Object.extend('Suggestion');
			var query = new Parse.Query(SuggestionObject);
			query.limit(queryLimit);
			query.equalTo('rejected', false);
			query.equalTo('moderated', true);
			if(request.params.skipIndex)
				query.skip(request.params.skipIndex);
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
			console.log('found suggetions: ' + allSuggestions.length);
			response.success(allSuggestions);
		} else {
			console.log('fetching more suggestions');
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
	console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(fetchData, onError);
	} else {
		onError();
	}

	function fetchData(isAdmin) {
		console.log('fetchData, isAdmin:');
		console.log(isAdmin);
		if(isAdmin) {
			console.log('user is admin');
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

function getCardsForSet(request, response) {
	console.log('getCardsForSet');
	Parse.Cloud.useMasterKey();
	var setId = request.params.id;
	console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(fetchData, onError);
	} else {
		onError();
	}

	function fetchData(isAdmin) {
		console.log('getCardsForSet fetchData');
		if(isAdmin) {
			console.log('user is admin');
			var SetObject = Parse.Object.extend('Set');
			var mockSet = new SetObject();
			mockSet.id = setId;
			var SetItemObject = Parse.Object.extend('SetItem');
			var query = new Parse.Query(SetItemObject);
			query.equalTo('owner', mockSet);
			query.include('card.owner');
			query.find({
				success: onSuccess,
				error: onError
			});
		} else {
			console.log('user is not admin');
			onError('You need to be an admin to access this page.');
		}
	}

	function onSuccess(setItems) {
		console.log('setItems found:' + setItems.length);
		response.success(setItems);
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
	console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(saveData, onError);
	} else {
		onError();
	}

	function saveData(isAdmin) {
		console.log('addCardToSet saveData');
		if(isAdmin) {
			console.log('user is admin');
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
		console.log('addCardToSet saveData success');
		response.success(setItem);
	}

	function onError(error) {
		console.log('addCardToSet saveData Error');
		response.error(error);
	}

}

function removeSetItem(request, response) {
	console.log('removeSetItem');
	Parse.Cloud.useMasterKey();
	console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(destroyItem, onError);
	} else {
		onError();
	}

	function destroyItem(isAdmin) {
		console.log('removeSetItem destroyItem');
		if(isAdmin) {
			console.log('user is admin');
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
		console.log('removeSetItem destroyItem success');
		response.success(setItem);
	}

	function onError(error) {
		console.log('removeSetItem destroyItem Error');
		response.error(error);
	}

}