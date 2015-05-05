'use strict';
app.controller('homeView', function($scope, $window, $timeout, analytics) {
	$window.scrollTo(0, 0);
	$scope.hidePreorder = true;
	$timeout(_onShowPreorder, 37000);
	$scope.$on('youtube.player.ready', _onPlayerReady);
	$scope.$on('$destroy', _onPlayerDestroyed);
	var originalVolume;
	$scope.homeVideoId = 'zc6W3j64BLE';
	$scope.playerVars = {
		autoplay: 1,
		playsinline: 1,
		showinfo: 0,
		controls: 0,
		loop: 1,
		rel: 0,
		listType: 'playlist',
		list: 'PLYdZzrn9xK8lRBa1TRMZCznn-Ba7tAaoF'
	};
	$scope.buyLink = 'http://godhatesgames.myshopify.com/cart/1051755037:1?source_app=shopify-widget?referer=https%3A%2F%2Fgodhatescharades.com';
	$scope.onBuyClicked = _onBuyClicked;
	// $scope.$watch('homeVideo.setVolume', _onHomeVideo);
	// $scope.$on('youtube.player.ready', _onPlayerReady);

	angular.element($window).bind('scroll', function() {
		if (this.pageYOffset >= 100) {
			_onShowPreorder();
		}
	});

	function _onShowPreorder() {
		$scope.hidePreorder = false;
		if(!$scope.$$phase) {
			$scope.$digest();
		}
	}

	function _onPlayerReady() {
		// play it again
		if($scope.homeVideo && $scope.homeVideo.setVolume) {
			$scope.homeVideo.setVolume(25);
		}
	}

	function _onPlayerDestroyed() {
		$scope.homeVideo.setVolume(originalVolume);
	}

	function _onBuyClicked(location, button) {
		analytics.mpEvent('Click', {
			'Location': location,
			'Button': button
		});
	}

});