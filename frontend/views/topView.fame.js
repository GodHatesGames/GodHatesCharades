app.controller('topView.fame', function(pairs, $scope, $filter, $state) {
	// public vars
	$scope.pairs = pairs;
	$scope.sortPredicates = ['-kdr',
	                         '-chosen',
	                         'skips'];
});