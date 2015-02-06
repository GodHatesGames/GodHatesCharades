app.controller('watchView', function(readyForUpload, ghcVids, $scope, $window) {
	$window.scrollTo(0, 0);
	$scope.ghcVids = ghcVids.items;
});