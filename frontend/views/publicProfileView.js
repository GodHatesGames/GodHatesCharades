app.controller('publicProfileView', function($scope, $stateParams, parseUser, $state) {
	$scope.userid = $stateParams.userid;
	$scope.parseUser = parseUser;
	$scope.currentUser = parseUser.isCurrentUser($scope.userid);
	$scope.betaUser = parseUser.isBetaUser();

	parseUser.getProfileById($scope.userid)
	.then(onProfileLoaded, onProfileError);

	function onProfileLoaded(profile) {
		var username = profile.owner.get('name');
		
		//set meta title
		$state.current.title = username;

		// set meta description
		$state.current.description = [username,
		                              '\'s profile page'].join('');
	}

	function onProfileError(error) {
		console.log('couldnt find user:', $scope.userid);
	}
});