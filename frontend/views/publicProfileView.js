app.controller('publicProfileView', function(publicProfile, $scope, $stateParams, $state, User) {
	$scope.publicProfile = publicProfile;
	$scope.User = User;

	//set meta title
	$state.current.title = [publicProfile.owner.name, '\'s profile'].join('');;

	// set meta description
	$state.current.description = [publicProfile.owner.name, '\'s public profile page'].join('');

});