'use strict';
app.controller('setsCreateView', function($scope, $state, sets) {
	$scope.saving = false;
	$scope.createSet = _createSet;

	function _createSet() {
		$scope.saving = true;

		sets.createSet({
			name: $scope.name
		})
		.then(_onSetCreated, _onCreateError);

		function _onSetCreated(newSet) {
			console.log('newSet created');
			$state.go('admin.sets');
			$scope.saving = false;
		}

		function _onCreateError(err) {
			console.log('err creating set:', err);
			$scope.saving = false;
		}
	};
});