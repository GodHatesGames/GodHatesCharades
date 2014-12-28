'use strict';
app.controller('setsView', function(setIdsByCardId, $scope, $state, sets) {
	$scope.sets = sets;

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