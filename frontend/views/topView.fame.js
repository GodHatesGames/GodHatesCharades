app.controller('topView.fame', function(pairs, $scope, pairService, $filter, $state, parseUser) {
	// public vars
	$scope.pairService = pairService;
	$scope.pairs = pairs;
	$scope.parseUser = parseUser;
	$scope.sortPredicates = ['-attributes.kdr',
	                         '-attributes.chosen',
	                         'attributes.skipped'];
});