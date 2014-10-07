'use strict';
var userUtils = require('cloud/v2/userUtils.js');
var config = require('cloud/config.js');
var Mandrill = require('mandrill');
Mandrill.initialize(config.MANDRILL_KEY);

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
			var card = request.params.card;

			// mock suggestion
			var SuggestionObject = Parse.Object.extend('Suggestion');
			var suggestion = new SuggestionObject();
			suggestion.id = card.id;
			suggestion.set('moderated', true);
			suggestion.set('rejected', false);
			suggestion.set('text', card.text);
			suggestion.set('legal', card.legal);
			suggestion.save({
				success: onDataSaved,
				error: onError
			});
		} else {
			console.log('user is not admin');
			onError('You need to be an admin to access this method.');
		}
	}

	function onDataSaved(suggestion) {
		_setCardImage(request.params.card, suggestion.get('type'));
		var params = _getMandrillMessage(request.params.recipient, request.params.email, request.params.card);
		var options = {};
		Mandrill.sendTemplate(params, {
			success: onSuccess,
			error: onError
		});
	}

	function onSuccess(result) {
		// console.log('approveSuggestion saveData success');

		response.success(result);
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
			var card = request.params.card;

			// mock suggestion
			var SuggestionObject = Parse.Object.extend('Suggestion');
			var suggestion = new SuggestionObject();
			suggestion.id = card.id;
			suggestion.set('moderated', true);
			suggestion.set('rejected', true);
			suggestion.save({
				success: onDataSaved,
				error: onError
			});
		} else {
			console.log('user is not admin');
			onError('You need to be an admin to access this method.');
		}
	}

	function onDataSaved(suggestion) {
		_setCardImage(request.params.card, suggestion.get('type'));
		var params = _getMandrillMessage(request.params.recipient, request.params.email, request.params.card);
		var options = {};
		Mandrill.sendTemplate(params, {
			success: onSuccess,
			error: onError
		});
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

function _getMandrillMessage(recipient, email, card) {
	return {
		template_name: 'single-card-email',
		template_content: [],
		async: false,
		message: {
			subject: email.subject,
			from_email: config.LIST_EMAIL,
			from_name: config.LIST_COMPANY,
			to: [{
				email: recipient.address,
				name: recipient.name,
				type: "to"
			}],
			headers: {
				'Reply-To': config.LIST_EMAIL
			},
			important: false,
			merge: true,
			global_merge_vars: [
				{
					name: 'LIST_COMPANY',
					content: config.LIST_COMPANY
				},
				{
					name: 'LIST_EMAIL',
					content: config.LIST_EMAIL
				},
			],
			merge_vars: [{
				rcpt: recipient.address,
				vars: [
					{
						name: 'card_url',
						content: card.url
					},{
						name: 'card_text',
						content: card.text
					},{
						name: 'card_image_url',
						content: card.image
					},{
						name: 'recipient_name',
						content: recipient.name
					},{
						name: 'email_message',
						content: email.message
					}
				]
			}],
			recipient_metadata: [{
				rcpt: recipient.address,
				values: {
					user_id: recipient.id
				}
			}]
		}
	}
}

function _setCardImage(card, type) {
	if(type == 0) {
		card.image = 'http://godhatescharades.com/img/email/actor.png';
	} else {
		card.image = 'http://godhatescharades.com/img/email/scenario.png';
	}
}