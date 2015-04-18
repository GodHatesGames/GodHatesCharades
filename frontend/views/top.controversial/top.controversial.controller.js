app.controller('topView.controversial', function(pairs, $scope, $filter, $state) {
	// public vars
	$scope.pairs = pairs;
	$scope.sortPredicates = ['controversy',
	                         '-skips',
	                         '-chosen'];
});