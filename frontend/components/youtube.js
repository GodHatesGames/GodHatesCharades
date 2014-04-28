'use strict';
app.directive('youtube', function($rootScope, $timeout) {
	return {
		restrict: 'E',
		scope: {
			videoId: '=id',
			aspectW: '@aspectW',
			aspectH: '@aspectH',
			fluid: '=fluid'
		},
		controller: function($scope, $element) {
			$scope.$watch('videoId', setIframe);

			// watch video width to allow responsive behavior
			if ($scope.fluid === true) {
				$scope.$watch(function() {
					// check parent element width
					return getWidth($element);
				}, function(newValue) {
					// update iframe width/height
					console.log('video width changed');
					if ($scope.videoId !== null && $scope.videoId !== undefined) {
						var newWidth = newValue;
						var newHeight = getHeightFromWidth(newWidth, $scope.aspectW, $scope.aspectH);
						var iframe = $element.children();
						iframe.attr('width', newWidth);
						iframe.attr('height', newHeight);
					}
				});
			}

			setIframe($scope.videoId);

			function setIframe(videoId) {
				if (videoId !== null && videoId !== undefined) {
					// clear old iframes
					$element.empty();
					//add new iframe
					var newWidth = getWidth($element);
					var newHeight = getHeightFromWidth(newWidth, $scope.aspectW, $scope.aspectH);
					var iframeStr = ['<iframe width="',
					                 newWidth,
					                 '" height="',
					                 newHeight,
					                 '" src="//www.youtube.com/embed/',
					                 videoId,
					                 '" frameborder="0" allowfullscreen></iframe>'].join('');
					var newIframe = angular.element(iframeStr);
					$element.append(newIframe);
				}
			}

			function getWidth(element) {
				return Math.floor(element.prop('offsetWidth'));
			}

			function getHeightFromWidth(width, aspectW, aspectH) {
				var aspectRatio = width / aspectW;
				return Math.floor(aspectH * aspectRatio);
			}
		}
	};
});