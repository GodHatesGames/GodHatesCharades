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
			size: 'lg'
		})

		function _onEditSuccess(updatedSuggestion) {
			console.log('modal success');
			suggestion.attributes.text = updatedSuggestion.attributes.text;
			suggestion.attributes.legal = updatedSuggestion.attributes.legal;
			// modalInstance.dismiss();
		}

		function _onEditError(err) {
			console.log('modal error', err);
			// modalInstance.dismiss();
		}
	}

	return modal;
});