'use strict';
app.directive('youtubeList', function(Restangular) {
	return {
		restrict: 'E',
		replace: true,
		scope: true,
		templateUrl: 'components/youtubeList.html',
		link: function($scope, $element, $attr){
			$scope.playerVars = {
				showinfo: 0,
				autohide: 1,
				rel: 0
			};

			$attr.$observe('query', function(newValue) {
				var newQuery = $scope.$eval(newValue);
				if(newQuery)
					_updateVideoPlayer(newQuery);
			});

			function _updateVideoPlayer(query) {
				var params = {
					part: 'snippet',
					key: CONFIG.YOUTUBE.key,
					q: query,
					type: 'video',
					order: 'date',
					videoSyndicated: true
				}
				Restangular.oneUrl('ghcVids', 'https://www.googleapis.com/youtube/v3/').one('search').get(params)
				.then(_onPlaylistFetched);
			}

			function _onPlaylistFetched(results) {
				$scope.playlist = results.items;
			}

		}
	}
});