'use strict';
app.directive('iframeFluid', function($window) {
	return {
		restrict: 'EA',
		scope: {
			iframeUrl: '=url',
			aspectW: '@aspectW',
			aspectH: '@aspectH',
			fluid: '=fluid',
			iframeThumb: '=thumb'
		},
		controller: function($scope, $element) {
			var currentWidth = getWidth($element);
			var thumbClicked = false;
			var thumb;
			$scope.$watch('iframeUrl', setIframe);
			$scope.$watch('iframeThumb', setThumb);

			// watch video width to allow responsive behavior
			if ($scope.fluid === true) {
				var windowElem = angular.element($window);
				windowElem.bind('resize', onResize);
			}

			setIframe($scope.iframeUrl);
			setThumb($scope.iframeThumb);

			function setThumb(iframeThumb) {
				if(!thumbClicked && iframeThumb && iframeThumb !== '') {
					// clear old iframes
					$element.empty();
					//add new iframe
					var newWidth = getWidth($element);
					var newHeight = getHeightFromWidth(newWidth, $scope.aspectW, $scope.aspectH);

					// create thumb
					thumb = angular.element('<div>');
					thumb.css('width', newWidth + 'px');
					thumb.css('height', newHeight + 'px');
					thumb.css('background-size', 'cover');
					thumb.css('cursor', 'pointer');
					thumb.css('background-image', ['url(',
					                               iframeThumb,
					                               ')'].join(''));
					thumb.bind('mouseenter', function() {
						thumb.css('background-position-y', '100%');
					});
					thumb.bind('mouseleave', function() {
						thumb.css('background-position-y', '0');
					});
					thumb.bind('click', function() {
						thumbClicked = true;
						setIframe($scope.iframeUrl);
					});
					console.log(thumb);
					$element.append(thumb);
				}
			}

			function setIframe(iframeUrl) {
				if($scope.iframeThumb && !thumbClicked)
					return;
				
				if (iframeUrl && iframeUrl !== '') {
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
				return element.prop('offsetWidth');
			}

			function getHeightFromWidth(width, aspectW, aspectH) {
				var aspectRatio = width / aspectW;
				return aspectH * aspectRatio;
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
					if(thumb) {
						thumb.css('width', newWidth + 'px');
						thumb.css('height', newHeight + 'px');
					}
				}
			}
		}
	};
});