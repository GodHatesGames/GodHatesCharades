var userUtils = require('cloud/userUtils.js');

exports.getUnmoderatedSuggestions = getUnmoderatedSuggestions;
exports.getAllSuggestions = getAllSuggestions;
exports.getAllSets = getAllSets;
exports.getCardsForSet = getCardsForSet;

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
	Parse.Cloud.useMasterKey();
	var cards = [];
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
