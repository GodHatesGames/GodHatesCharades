'use strict';
app.directive('youtube', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: false,
		templateUrl: 'components/youtube.html',
		link: function($scope, $element, $attr){
			$attr.$observe('id', function(newValue) {
				var newId = $scope.$eval(newValue);
				if(newId)
					_updateVideoPlayer(newId);
			});

			// allow a simple string in the attribute
			$attr.$observe('videoId', function(newValue) {
				if(newValue)
					_updateVideoPlayer(newValue);
			});

			// allow a simple string in the attribute
			$attr.$observe('list', function(newValue) {
				var newList = $scope.$eval(newValue);
				if(newList)
					_updateListPlayer(newList);
			});

			var youtubeUrl = '//www.youtube.com/embed';
			function _updateVideoPlayer(newId) {
				var videoUrl = [youtubeUrl, newId].join('/');
				_updatePlayer(videoUrl);
			}

			function _updateListPlayer(newList) {
				var attributes = [];
				attributes.push('listType=search');
				attributes.push('list=' + newList);
				_updatePlayer(youtubeUrl, attributes);
			}

			function _updatePlayer(videoUrl, videoAttrs) {
				var attributes = videoAttrs || [];
				if ($attr.autoplay === 'true')
					attributes.push('autoplay=1');

				var urlAttrs = attributes.join('&');
				videoUrl = [videoUrl, '?', urlAttrs].join('');
				$attr.$set('url', videoUrl);
			};
		}
	}
});