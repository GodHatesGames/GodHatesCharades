app.controller('topView.controversial', function(pairs, $scope, pairService, $filter, $state, parseUser) {
	// public vars
	$scope.pairService = pairService;
	$scope.pairs = pairs;
	$scope.parseUser = parseUser;
	$scope.sortPredicates = ['attributes.controversy',
	                         '-attributes.skipped',
	                         '-attributes.chosen'];
});