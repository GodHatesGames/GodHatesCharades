'use strict';
app.controller('homeView', function($scope, $window, $timeout) {
	$window.scrollTo(0, 0);
	$scope.hidePreorder = true;
	$timeout(_onShowPreorder, 37000);

	angular.element($window).bind('scroll', function() {
		if (this.pageYOffset >= 100) {
			_onShowPreorder();
		}
	});

	function _onShowPreorder() {
		$scope.hidePreorder = false;
		$scope.preorderClass= 'animated pulse';
		if(!$scope.$$phase) {
			$scope.$digest();
			$timeout(_animatePreorder, 500);
		}
	}

	function _animatePreorder() {
	}
});