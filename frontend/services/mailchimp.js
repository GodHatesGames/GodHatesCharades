app.service('mailchimp', function($http) {
	function subscribe(email) {
		return $http.post('api/subscribe', {
			email: email
		});
	}
	return {
		subscribe: subscribe
	};


})