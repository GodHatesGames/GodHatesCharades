'use strict';
app.controller('setsDetailView', function(set, $scope, $state, $stateParams) {
	$scope.saving = false;
	$scope.set = set;
	$scope.actorCount = 0;
	$scope.scenarioCount = 0;
	$scope.removeSetItem = _removeSetItem;
	$scope.$watch('sets.setItemsBySetId[set.id].length', _updateCount);

	$scope.deleteSet = function() {
		$scope.saving = true;
		sets.deleteSet(set)
		.then(function success() {
			$scope.saving = false;
			console.log('newSet deleted');
			$state.go('admin.sets');
		},
		function error(err) {
			$scope.saving = false;
			console.log('err saving set:', err);
		});
	};

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
		sets.removeSetItem(setItem)
		.then(_updateCount);
	}

});