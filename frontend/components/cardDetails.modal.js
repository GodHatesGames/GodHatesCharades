app.service('cardDetailsModal', function($modal) {
	var modal = {
		show: _show
	};
	function _show(isolatedScope, suggestion) {
		var modalScope = isolatedScope.$new(true);
		modalScope.suggestion = suggestion;
		modalScope.onSuccess = _onEditSuccess;
		modalScope.onError = _onEditError;

		var modalInstance = $modal.open({
			templateUrl: 'components/cardDetails.modal.html',
			scope: modalScope,
			size: 'lg',
			resolve: {
				currentItems: ['SetItem', function(SetItem) {
					return suggestion.getSetItems();
				}],
				sets: ['Set', function(Set) {
					return Set.findAll();
				}]
			},
			controller: ['currentItems', 'sets', '$scope', _modalController]
		});

		function _modalController(currentItems, sets, $scope) {
			$scope.sets = sets;
		}

		function _onEditSuccess(updatedSuggestion) {
			console.log('modal success');
			suggestion.text = updatedSuggestion.attributes.text;
			suggestion.legal = updatedSuggestion.attributes.legal;
			// modalInstance.dismiss();
		}

		function _onEditError(err) {
			console.log('modal error', err);
			// modalInstance.dismiss();
		}
	}

	return modal;
});