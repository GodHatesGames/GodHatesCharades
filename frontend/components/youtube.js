'use strict';
app.directive('youtube', function() {
	return {
		restrict: 'E',
		replace: true,
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
				$scope.videoUrl = '//www.youtube.com/embed/' + newId;
				if ($attr.autoplay === 'true')
					$scope.videoUrl += '?autoplay=1'
			};
		}
	}
});