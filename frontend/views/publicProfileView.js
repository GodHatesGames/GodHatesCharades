app.controller('publicProfileView', function(profile, $scope, $stateParams, parseUser, $state) {
	$scope.profile = profile;
	$scope.currentUser = parseUser.isCurrentUser(profile.owner.id);
	$scope.betaUser = parseUser.isBetaUser();

	var username = profile.owner.get('name');
	
	//set meta title
	$state.current.title = [username, '\'s profile'].join('');;

	// set meta description
	$state.current.description = [username, '\'s public profile page'].join('');

});