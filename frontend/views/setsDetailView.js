'use strict';
app.controller('setsDetailView', function(set, setItems, $scope, $state, $stateParams, SetItem, $modal) {
	$scope.saving = false;
	$scope.set = set;
	$scope.actorCount = 0;
	$scope.scenarioCount = 0;
	$scope.removeSetItem = _removeSetItem;
	$scope.editSuggestion = _editSuggestion;
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

	function _removeSetItem($event, setItem) {
		$event.stopImmediatePropagation();
		SetItem.destroy(setItem.id)
		.then(_updateCount);
	}

	function _editSuggestion(isolatedScope, suggestion) {
		var modalScope = $scope.$new(true);
		modalScope.suggestion = suggestion;
		modalScope.onSuccess = _onEditSuccess;
		modalScope.onError = _onEditError;

		var modalInstance = $modal.open({
			templateUrl: 'components/cardDetails.modal.html',
			scope: modalScope,
			size: 'lg'
		})

		function _onEditSuccess() {
			console.log('modal success');
			suggestion.text = updatedSuggestion.attributes.text;
			suggestion.legal = updatedSuggestion.attributes.legal;
		}

		function _onEditError(err) {
			console.log('modal error', err);
			// modalInstance.dismiss();
		}
	}

});