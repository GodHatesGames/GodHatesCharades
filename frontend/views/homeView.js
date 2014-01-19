app.controller('homeView', function($scope, campaignService) {
	$scope.kickstarter = campaignService.campaignsById['ks2013'];
});