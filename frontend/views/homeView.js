'use strict';
app.controller('homeView', function($scope, $window, $timeout, analytics) {
	$window.scrollTo(0, 0);
	$scope.hidePreorder = true;
	$timeout(_onShowPreorder, 37000);
	$scope.$on('youtube.player.ready', _onPlayerReady);
	$scope.playerVars = {
		autoplay: 1,
		playsinline: 1,
		showinfo: 0,
		autohide: 1,
		rel: 0
	};
	$scope.preorderLink = 'http://godhatesgames.myshopify.com/cart/1051755037:1?source_app=shopify-widget?referer=https%3A%2F%2Fgodhatescharades.com';
	$scope.onPreorderClicked = _onPreorderClicked;

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

	function _onPlayerReady($event, player) {
		// play it again
		player.setVolume(0);
	}

	function _onPreorderClicked(location, button) {
		analytics.mpEvent('Click', {
			'Location': location,
			'Button': button
		});
	}

});