var mcapi = require('mailchimp-api');
var mc = new mcapi.Mailchimp(process.env.MAILCHIMP_API_KEY);
var disposable = require('is-disposable-email');

module.exports.subscribe = subscribe;

function subscribe(req, res){
	var disposableEmail = disposable(req.body.email);
	var mailingListId = disposableEmail ? process.env.MAILCHIMP_DISPOSABLE_LIST_ID : process.env.MAILCHIMP_LIST_ID;
	// no double opt in for fake emails, ie their in a different list so we dont care
	var optIn = !disposableEmail;
	mc.lists.subscribe({
			id: mailingListId,
			double_optin: optIn,
			email: {
				email: req.body.email
			}
		}, function(data) {
			res.send(200, 'subscription successful');
		},
		function(error) {
			if (error.error) {
				res.send(400, 'Oops! ' + error.error);
			} else {
				res.send(400, 'Something went wrong, please try again.');
			}
		});
};