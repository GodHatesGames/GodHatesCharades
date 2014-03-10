'use strict';
app.controller('homeView', function($scope, campaignService) {
	$scope.kickstarter = campaignService.campaignsById.ks2013;
	$scope.ipad = campaignService.campaignsById.iPad2014;

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

});