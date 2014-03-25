app.controller('publicProfileView', function($scope, $stateParams, parseUser) {
	$scope.userid = $stateParams.userid;
	$scope.parseUser = parseUser;
	$scope.currentUser = parseUser.isCurrentUser($scope.userid);
	$scope.betaUser = parseUser.isBetaUser();
});