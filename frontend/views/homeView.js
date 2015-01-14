'use strict';
app.controller('homeView', function($scope, $window, $timeout) {
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

});