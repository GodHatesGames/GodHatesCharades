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
					_updatePlayer(newId);
			});

			// allow a simple string in the attribute
			$attr.$observe('videoId', function(newValue) {
				if(newValue)
					_updatePlayer(newValue);
			});

			function _updatePlayer(newId) {
				var videoUrl = '//www.youtube.com/embed/' + newId;
				if ($attr.autoplay === 'true')
					videoUrl += '?autoplay=1'
				$attr.$set('url', videoUrl);
			};
		}
	}
});