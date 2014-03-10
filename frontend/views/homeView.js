'use strict';
app.controller('homeView', function($scope, campaignService) {
	$scope.kickstarter = campaignService.campaignsById.ks2013;
	$scope.ipad = campaignService.campaignsById.iPad2014;
});