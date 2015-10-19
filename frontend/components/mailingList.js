'use strict';
app.directive('mailingList', function(User) {
	return {
		restrict: 'E',
		templateUrl: 'components/mailingList.html',
		replace: true,
		scope: {
			onSuccess: '=onSuccess',
			location: '@location'
		},
		controller: function($scope, $element, mailingList) {
			$scope.submitted = false;
			$scope.sending = false;
			$scope.subscribe = function() {
				$scope.sending = true;
				$scope.errorMessage = null;
				if(!$scope.spamValue && $scope.email && $scope.email.length > 0) {
					mailingList.subscribe($scope.email)
					.then(onSubscribeComplete, onSubscribeError);
				}
			}

			function onSubscribeComplete(result) {
				console.log('subscribed:', result);
				if($scope.onSuccess)
					$scope.onSuccess($scope.location);
				$scope.submitted = true;
				$scope.sending = false;
			}

			function onSubscribeError(err) {
				console.log('error subscribing:', err);
				$scope.errorMessage = err.data;
				$scope.sending = false;
			}
		}
	};
});