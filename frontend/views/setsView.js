'use strict';
app.controller('setsView', function(allSets, $scope, $state, sets) {
	$scope.allSets = allSets;

	$scope.showSet = function(set) {
		$state.go('admin.sets.detail', {
			id: set.id
		});
	};

	$scope.isActive = function(set) {
		return $state.includes('admin.sets.detail', {
			id: set.id
		});
	};
});