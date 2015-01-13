app.controller('topView.controversial', function(pairs, $scope, $filter, $state) {
	// public vars
	$scope.pairs = pairs;
	$scope.parseUser = parseUser;
	$scope.sortPredicates = ['controversy',
	                         '-skips',
	                         '-chosen'];
});