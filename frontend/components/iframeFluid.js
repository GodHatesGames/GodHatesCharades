'use strict';
app.directive('iframeFluid', function($window) {
	return {
		restrict: 'EA',
		scope: {
			iframeUrl: '=url',
			aspectW: '@aspectW',
			aspectH: '@aspectH',
			fluid: '=fluid'
		},
		controller: function($scope, $element) {
			$scope.$watch('iframeUrl', setIframe);
			var currentWidth = getWidth($element);

			// watch video width to allow responsive behavior
			if ($scope.fluid === true) {
				var windowElem = angular.element($window);
				windowElem.bind('resize', onResize);
			}

			setIframe($scope.iframeUrl);

			function setIframe(iframeUrl) {
				if (iframeUrl !== null && iframeUrl !== undefined && iframeUrl !== '') {
					// clear old iframes
					$element.empty();
					//add new iframe
					var newWidth = getWidth($element);
					var newHeight = getHeightFromWidth(newWidth, $scope.aspectW, $scope.aspectH);
					var iframeStr = ['<iframe width="',
					                 newWidth,
					                 '" height="',
					                 newHeight,
					                 '" src="',
					                 iframeUrl,
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

			function onResize() {
				// update iframe width/height
				var newWidth = getWidth($element);
				if ($scope.iframeUrl !== null && $scope.iframeUrl !== undefined && newWidth != currentWidth) {
					console.log('video width changed');
					currentWidth = newWidth;
					var newHeight = getHeightFromWidth(newWidth, $scope.aspectW, $scope.aspectH);
					var iframe = $element.children();
					iframe.attr('width', newWidth);
					iframe.attr('height', newHeight);
				}
			}
		}
	};
});