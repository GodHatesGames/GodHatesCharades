'use strict';
app.controller('setsView', function(sets, suggestions, $scope, $state) {
	$scope.sets = sets;
	$scope.suggestions = suggestions;

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