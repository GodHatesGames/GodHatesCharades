'use strict';
app.controller('setsCreateView', function($scope, $state, Set, $stateParams) {
	$scope.saving = false;
	$scope.createSet = _createSet;

	function _createSet() {
		$scope.saving = true;

		Set.create({
			name: $scope.name
		})
		.then(_onSetCreated, _onCreateError);

		function _onSetCreated(newSet) {
			console.log('newSet created');
			$scope.sets.push(newSet);
			$state.go('admin.sets.detail', newSet);
			$scope.saving = false;
		}

		function _onCreateError(err) {
			console.log('err creating set:', err);
			$scope.saving = false;
		}
	};
});