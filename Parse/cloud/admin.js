// var _ = require('underscore');

exports.getUnmoderatedSuggestions = getUnmoderatedSuggestions;

function getUnmoderatedSuggestions(request, response) {
	var SuggestionObject = Parse.Object.extend('Suggestion');
	
	var query = new Parse.Query(SuggestionObject);
	query.limit(1000);
	query.notEqualTo('rejected', true);
	query.notEqualTo('moderated', true);
	query.find({
		success: onSuccess,
		error: onError
	});

	function onSuccess(suggestions) {
		response.success(suggestions);
	}

	function onError(suggestions, error) {
		response.error(error);
	}

};