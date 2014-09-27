var _ = require('underscore');
exports.getBackerByEmail = getBackerByEmail;

function getBackerByEmail(email) {
	// to allow fetching owners
	Parse.Cloud.useMasterKey();

	var Backer = Parse.Object.extend('Backer');
	var query = new Parse.Query(Backer);
	query.equalTo('email', email);
	return query.first({
		success: function(backer) {
			if(backer) {
				return true;
			} else {
				return false;
			}
		},
		error: function(err) {
			console.log('err' + JSON.stringify(err));
		}
	});
}