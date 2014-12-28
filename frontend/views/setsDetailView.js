'use strict';
app.controller('setsDetailView', function(set, $scope, $state, $stateParams, cardService, sets) {
	$scope.saving = false;
	$scope.cardService = cardService;
	$scope.sets = sets;
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
		_.each(sets.setItemsBySetId[set.id], function(setItem) {
			var type = setItem.get('card').get('type');
			if(type === 0) {
				// actor
				actors++;
			} else if(type === 1) {
				scenarios++;
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