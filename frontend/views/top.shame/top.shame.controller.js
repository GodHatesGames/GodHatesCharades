app.controller('topView.shame', function(pairs, $scope, $filter, $state) {
	// public vars
	$scope.pairs = pairs;
	$scope.sortPredicates = ['kdr',
	                         '-skips',
	                         'chosen'];
});