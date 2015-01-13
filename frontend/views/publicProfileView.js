app.controller('publicProfileView', function(profile, $scope, $stateParams, parseUser, $state, User) {
	$scope.profile = profile;
	$scope.User = User;

	//set meta title
	$state.current.title = [profile.owner.name, '\'s profile'].join('');;

	// set meta description
	$state.current.description = [profile.owner.name, '\'s public profile page'].join('');

});