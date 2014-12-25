app.controller('topView.shame', function(pairs, $scope, pairService, $filter, $state, parseUser) {
	// public vars
	$scope.pairs = pairs;
	$scope.parseUser = parseUser;
	$scope.sortPredicates = ['attributes.kdr',
	                         '-attributes.skipped',
	                         'attributes.chosen'];
});