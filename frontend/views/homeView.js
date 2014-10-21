'use strict';
app.controller('homeView', function($scope, campaignService, $http, $window, $stateParams, $state) {
	$window.scrollTo(0, 0);
	$scope.ipad = campaignService.campaignsById.iPad2014;
	$scope.mainLayout = undefined;
	$scope.emailSubmitted = false;
});