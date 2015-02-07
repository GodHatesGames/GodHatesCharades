'use strict';
app.directive('youtubeList', function(Restangular) {
	return {
		restrict: 'E',
		replace: true,
		scope: true,
		templateUrl: 'components/youtubeList.html',
		link: function($scope, $element, $attr){
			var currentQuery;
			$scope.playerVars = {
				showinfo: 0,
				autohide: 1,
				rel: 0
			};
			$scope.onVideoReady = _onVideoReady;

			$attr.$observe('query', function(newValue) {
				currentQuery = $scope.$eval(newValue);
				if(currentQuery)
					_updateVideoPlayer(currentQuery);
			});

			function _updateVideoPlayer(query, newVideoId) {
				var params = {
					part: 'id',
					key: CONFIG.YOUTUBE.key,
					q: query,
					type: 'video',
					order: 'date',
					videoSyndicated: true
				}
				$scope.playlist = [];
				Restangular.oneUrl('ghcVids', 'https://www.googleapis.com/youtube/v3/').one('search').get(params)
				.then(_onPlaylistFetched);
			}

			function _onPlaylistFetched(results) {
				_.each(results.items, function(video) {
					_getVideo(video.id.videoId)
					.then(_onPlaylistVideoFetched);
				});
			}

			function _onPlaylistVideoFetched(results) {
				var video = results.items[0];
				$scope.playlist.push(video);
			}

			function _onVideoReady(newVideoId) {
				_onNewVideoId(newVideoId);
			}

			function _onNewVideoId(newValue) {
				_getVideo(newValue)
				.then(_onPlaylistVideoFetched);
			}

			function _newVideoFetched(results) {
				$scope.newVideo = results.items[0];
			}

			function _getVideo(id) {
				var params = {
					part: 'snippet',
					key: CONFIG.YOUTUBE.key,
					id: id
				};
				return Restangular.oneUrl('ghcVid', 'https://www.googleapis.com/youtube/v3/').one('videos').get(params);
			}

		}
	}
});