'use strict';
app.controller('setsDetailView', function(set, setItems, $scope, $state, $stateParams, SetItem, $modal) {
	$scope.saving = false;
	$scope.set = set;
	$scope.actorCount = 0;
	$scope.scenarioCount = 0;
	$scope.removeSetItem = _removeSetItem;
	$scope.editSuggestion = _editSuggestion;
	$scope.$watch('set.suggestions', _updateCount);
	$scope.list = {
		search: null,
		searchProps: ['text']
	};

	function _updateCount() {
		var actors = 0;
		var scenarios = 0;
		_.each(set.suggestions, function(suggestion) {
			if(suggestion.type === 0) {
				// actor
				actors++;
			} else if(suggestion.type === 1) {
				scenarios++;
			}
		});
		$scope.actorCount = actors;
		$scope.scenarioCount = scenarios;
	}

	function _removeSetItem($event, suggestion) {
		var setItem = _.findWhere(set.setItems, {cardId: suggestion.id});
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