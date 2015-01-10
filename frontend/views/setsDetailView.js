'use strict';
app.controller('setsDetailView', function(set, $scope, $state, $stateParams, SetItem) {
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
			var card = setItem.card;
			if(card) {
				var type = setItem.card.type;
				if(type === 0) {
					// actor
					actors++;
				} else if(type === 1) {
					scenarios++;
				}
			} else {
				console.log('setItem', setItem.id, 'has no card');
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