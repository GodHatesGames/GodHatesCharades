app.controller('watchView', function(readyForUpload, ghcVids, $scope, $window, $filter) {
	$window.scrollTo(0, 0);
	var orderedVids = $filter('orderBy')(ghcVids.items, '-snippet.publishedAt');
	var chunkedVids = $filter('chunk')(orderedVids, 3);
	$scope.ghcVids = chunkedVids;
  $scope.playerVars = {
    autoplay: 1,
    playsinline: 1,
    rel: 0
  };
});