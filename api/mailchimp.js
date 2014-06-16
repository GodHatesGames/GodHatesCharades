var config = require('./config');
var mcapi = require('mailchimp-api');
var mc = new mcapi.Mailchimp(config.MAILCHIMP_API_KEY);

module.exports.subscribe = subscribe;

function subscribe(req, res){
	mc.lists.subscribe({
			id: config.MAILCHIMP_LIST_ID,
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