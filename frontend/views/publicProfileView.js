app.controller('publicProfileView', function(profile, $scope, $stateParams, parseUser, $state) {
	$scope.profile = profile;
	$scope.currentUser = parseUser.isCurrentUser(profile.owner.id);
	$scope.betaUser = parseUser.isBetaUser();

	//set meta title
	$state.current.title = [profile.owner.name, '\'s profile'].join('');;

	// set meta description
	$state.current.description = [profile.owner.name, '\'s public profile page'].join('');

});