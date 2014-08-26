'use strict';
app.directive('youtubeUpload', function() {
	return {
		restrict: 'E',
		templateUrl: 'components/youtubeUpload.html',
		link: function($scope, $element) {
			var widget = new YT.UploadWidget('youtubeUpload', {
				width: 600,
				height: 300,
				events: {
					'onUploadSuccess': onUploadSuccess,
					'onProcessingComplete': onProcessingComplete
				}
			});

			function onUploadSuccess(event) {
				console.log('upload complete');
				$scope.videoProcessing = true;
			}

			function onProcessingComplete(event) {
				$scope.videoId = event.data.videoId
				$scope.$digest();
			}
		}
	}
});