'use strict';
app.directive('mailchimp', function(User, $mixpanel) {
	return {
		restrict: 'E',
		templateUrl: 'components/mailchimp.html',
		replace: true,
		scope: {
			onSuccess: '=onSuccess',
			location: '@location'
		},
		controller: function($scope, $element, mailchimp) {
			$scope.submitted = false;
			$scope.sending = false;
			$scope.subscribe = function() {
				$scope.sending = true;
				$scope.errorMessage = null;
				if(!$scope.spamValue && $scope.email && $scope.email.length > 0) {
					mailchimp.subscribe($scope.email)
					.then(onSubscribeComplete, onSubscribeError);
				}
			}

			function onSubscribeComplete(result) {
				console.log('subscribed:', result);
				if($scope.onSuccess)
					$scope.onSuccess($scope.location);
				$scope.submitted = true;
				$scope.sending = false;
				
				// update mixpanel user
				$mixpanel.people.set({
					'$email': $scope.email
				});
				if($mixpanel.get_distinct_id() != $scope.email) {
					// alias their old id
					$mixpanel.alias($scope.email, $mixpanel.get_distinct_id());
				}
				$mixpanel.identify($scope.email);
			}

			function onSubscribeError(err) {
				console.log('error subscribing:', err);
				$scope.errorMessage = err.data;
				$scope.sending = false;
			}
		}
	};
});