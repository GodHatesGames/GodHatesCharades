'use strict';
app.controller('setsView', function(sets, suggestions, $scope, $state, Set, $stateParams) {
	$scope.sets = sets;
	$scope.suggestions = suggestions;
	$scope.ilikedanger = false;
	$scope.isActive = _isActive;
	$scope.showSet = _showSet;
	$scope.deleteClass = _deleteClass;
	$scope.deleteSet = _deleteSet;

	function _deleteSet(set) {
		if($scope.ilikedanger) {
			$scope.saving = true;
			set.DSDestroy()
			.then(Set.getAllSetsAndItems)
			.then(function success(sets) {
				$scope.saving = false;
				console.log('newSet deleted');
				$scope.sets = sets;
			},
			function error(err) {
				$scope.saving = false;
				console.log('err saving set:', err);
			});
		} else {
			$scope.ilikedanger = true;
		}
	}

	function _deleteClass() {
		if($scope.ilikedanger)
			return 'btn-danger';
		else
			return 'btn-info';
	}

	function _showSet(set) {
		if(!_isActive(set)) {
			$scope.ilikedanger = false;
			$state.go('admin.sets.detail', {
				id: set.id
			});
		}
	}

	function _isActive(set) {
		return $state.includes('admin.sets.detail', {
			id: set.id
		});
	}
});