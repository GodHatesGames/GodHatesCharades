'use strict';
app.directive('mailchimp', function() {
	return {
		restrict: 'E',
		templateUrl: 'components/mailchimp.html',
		replace: true
	};
});