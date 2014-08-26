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
				if(typeof gapi != 'undefined') {
					gapi.ytsubscribe.go($element[0]);
				}
			}
		}
	}
});