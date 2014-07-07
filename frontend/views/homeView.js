'use strict';
app.controller('homeView', function($scope, campaignService, $http, $window, $stateParams, $state, leanplum) {
	$scope.kickstarter = campaignService.campaignsById.ks2013;
	$scope.ipad = campaignService.campaignsById.iPad2014;
	$scope.leanplum = leanplum;
	$scope.mainLayout = undefined;
	$scope.emailSubmitted = false;

	if ($stateParams.vine) {
		$scope.vineId = $stateParams.vine;
		// $state.go('home.vineUnlock');
		$scope.mainLayout = 'views/homeView.vineUnlock.html';
	} else if($stateParams.youtube) {
		$scope.youtubeId = $stateParams.youtube;
		// $state.go('home.videoUnlock');
		$scope.mainLayout = 'views/homeView.videoUnlock.html';
	} else {
		$scope.$watch('leanplum.vars.homeLayout', function(newValue) {
			if(newValue) {
				$scope.mainLayout = 'views/homeView.' + newValue + '.html';
				// $state.go('home.' + newValue);
			}
		});
	}

	$scope.currentSlide = 0;
	$scope.maxSlides = 3;
	$scope.getSlideForIndex = function(index) {
		if(index === $scope.currentSlide) {
			return 'curr';
		} else if(index < $scope.currentSlide) {
			return 'prev';
		} else {
			return 'next';
		}
	};

	$scope.prevSlide = function() {
		if ($scope.currentSlide > 0)
			$scope.currentSlide--;
	};

	$scope.nextSlide = function() {
		if ($scope.currentSlide < $scope.maxSlides)
			$scope.currentSlide++;
	};

	$scope.onEmailSubmitted = function(fromLabel) {
		console.log('email submitted');
		$scope.emailSubmitted = true;
		Leanplum.track('Signed up for email updates');
		ga('send', 'event', 'signup', 'newsletter', fromLabel);
		_pa.track('signup_newletter');
	};

});