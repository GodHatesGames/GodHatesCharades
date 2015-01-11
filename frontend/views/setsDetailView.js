'use strict';
app.controller('setsDetailView', function(set, suggestions, $scope, $state, $stateParams, SetItem) {
	$scope.saving = false;
	$scope.set = set;
	$scope.actorCount = 0;
	$scope.scenarioCount = 0;
	$scope.removeSetItem = _removeSetItem;
	$scope.$watch('set.setItems', _updateCount);

	function _updateCount() {
		var actors = 0;
		var scenarios = 0;
		_.each(set.setItems, function(setItem) {
			if(setItem.card) {
				if(setItem.card.type === 0) {
					// actor
					actors++;
				} else if(setItem.card.type === 1) {
					scenarios++;
				}
			} else {
				console.log('setItem', setItem.id, 'has no suggestion');
			}
		});
		$scope.actorCount = actors;
		$scope.scenarioCount = scenarios;
	}

	function _removeSetItem(setItem) {
		SetItem.destroy(setItem.id)
		.then(_updateCount);
	}

});