app.controller('watchView', function(readyForUpload, ghcVids, $scope, $window, $filter) {
	$window.scrollTo(0, 0);
	var orderedVids = $filter('orderBy')(ghcVids.items, '-snippet.publishedAt');
	var chunkedVids = $filter('chunk')(orderedVids, 2);
	$scope.ghcVids = chunkedVids;
});