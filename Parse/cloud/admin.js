var userUtils = require('cloud/userUtils.js');

exports.getUnmoderatedSuggestions = getUnmoderatedSuggestions;
exports.getAllSuggestions = getAllSuggestions;

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

};

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

	function fetchData(isAdmin, skip) {
		console.log('fetchData, isAdmin:');
		console.log(isAdmin);
		if(isAdmin) {
			console.log('user is admin');
			var SuggestionObject = Parse.Object.extend('Suggestion');
			var query = new Parse.Query(SuggestionObject);
			query.limit(queryLimit);
			query.equalTo('rejected', false);
			query.equalTo('moderated', true);
			if(skip)
				query.skip(skip);
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

};