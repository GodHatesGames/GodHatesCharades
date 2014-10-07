'use strict';
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_KEY);

module.exports.sendSingleCardMessage = _sendSingleCardMessage;

function _sendSingleCardMessage(req, res) {
	req.params.recipient = {
		id: '1234',
		address: 'ghelton@gmail.com'
	};

	req.params.recipient.id = 1234;
	req.params.recipient.address = 1234;
	var template_name = "single-card-email";
	var template_content = [];
	var message = _getMessage(req.params.recipient, req.params.email, req.params.card);
	mandrill_client.messages.sendTemplate({
		template_name: template_name,
		template_content: template_content,
		message: message,
		async: false
	}, function(result) {
		console.log('that may have worked');
		console.log(result);
	}, function(e) {
		// Mandrill returns the error as an object with name and message keys
		console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		// A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	});
};

function _getMessage(recipient, email, card) {
	return {
		subject: email.subject,
		from_email: process.env.LIST_EMAIL,
		from_name: process.env.LIST_COMPANY,
		to: [{
			email: recipient.address,
			name: recipient.name,
			type: "to"
		}],
		headers: {
			'Reply-To': process.env.LIST_EMAIL
		},
		important: false,
		merge: true,
		global_merge_vars: [
			{
				name: 'LIST_COMPANY'
				content: process.env.LIST_COMPANY
			},{
				name: 'LIST_EMAIL'
				content: process.env.LIST_EMAIL
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