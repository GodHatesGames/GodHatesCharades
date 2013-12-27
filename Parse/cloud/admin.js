var userUtils = require('cloud/userUtils.js');

exports.getUnmoderatedSuggestions = getUnmoderatedSuggestions;

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