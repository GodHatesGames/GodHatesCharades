'use strict';
app.directive('ytSubscribe', function() {
	return {
		restrict: 'E',
		scope: {
			channel: '@channel'
		},
		templateUrl: 'components/ytSubscribe.html',
		link: function($scope, $element) {
			$scope.$watch('channel', onChannelUpdated);

			function onChannelUpdated(newValue) {
				gapi.ytsubscribe.go($element[0]);
			}
		}
	}
});