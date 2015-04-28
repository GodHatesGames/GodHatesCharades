app.directive('cardDetailsModal', function($modal) {
	return {
		restrict: 'A', /* E: Element, C: Class, A: Attribute M: Comment */
		link: function($scope, $element, $attr) {
			$element.bind('click', _show);

			function _show() {
				var suggestion = $scope.$eval($attr.cardDetailsModal);
				if(suggestion) {
					var modalScope = $scope.$new(true);
					modalScope.suggestion = suggestion;
					modalScope.onSuccess = _onEditSuccess;
					modalScope.onError = _onEditError;

					var modalInstance = $modal.open({
						templateUrl: 'components/cardDetails.modal.html',
						scope: modalScope,
						size: 'lg',
						resolve: {
							currentItems: function() {
								return suggestion.getSetItems();
							},
							sets: function(Set) {
								return Set.findAll();
							}
						},
						controller: function (currentItems, sets, $scope) {
							$scope.sets = sets;
						}
					});
				} else {
					console.error('cardDetailsModal: must provide suggestion to load');
				}


				function _onEditSuccess(updatedSuggestion) {
					console.log('modal success');
					suggestion.text = updatedSuggestion.text;
					suggestion.legal = updatedSuggestion.legal;
				}

				function _onEditError(err) {
					console.log('modal error', err);
				}
			}
		}
	};
})