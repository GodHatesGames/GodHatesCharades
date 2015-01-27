'use strict';
app.directive('youtubeUpload', function(ytUploadService) {
	return {
		restrict: 'E',
		templateUrl: 'components/youtubeUpload.html',
		scope: {
			title: '=',
			description: '=',
			keywords: '='
		},
		controller: function($scope, $element) {
			$scope.uploadClass = _uploadClass;

			var widget = ytUploadService.createUpload('youtubeUpload', {
				width: 600,
				height: 300,
				events: {
					onStateChange: _onStateChange,
					onUploadSuccess: _onUploadSuccess,
					onProcessingComplete: _onProcessingComplete,
					onApiReady: _onApiReady
				}
			});

			function _onApiReady(event) {
				console.log('onapiready');
				widget.setVideoTitle($scope.title);
				widget.setVideoDescription($scope.description);
				widget.setVideoKeywords($scope.keywords);
			}

			function _onStateChange(event) {
				// https://developers.google.com/youtube/youtube_upload_widget#onStateChange
				console.log('yt uploader triggered:', event.data.state);
				switch(event.data.state) {
					case YT.UploadWidgetState.IDLE :
						// user has triggered the Record button, though recording has not yet started
						if(!$scope.recording) {
							ga('send', 'event', 'youtube', 'recording', 'started');
							mixpanel.track('YouTube: Recording');
						}
						$scope.recording = true;
						break;
					case YT.UploadWidgetState.STOPPED :
						// user has triggered the Record button, though recording has not yet started
						$scope.recording = false;
						break;
					default :
						break;
				}

				$scope.$digest();
			}

			function _onUploadSuccess(event) {
				console.log('upload complete');
				ga('send', 'event', 'youtube', 'upload', 'complete');
				mixpanel.track('YouTube: Uploaded');
				$scope.videoProcessing = true;
			}

			function _onProcessingComplete(event) {
				$scope.videoId = event.data.videoId;
				$scope.$digest();
			}

			function _uploadClass() {
				if($scope.recording)
					return 'recording';
				else
					return '';
			}
		}
	}
});