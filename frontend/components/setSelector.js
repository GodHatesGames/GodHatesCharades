app.directive('setSelector', function(parseUser, pairService, $rootScope, sets) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/setSelector.html',
		replace: true,
		scope: {
			suggestion: '=suggestion'
		},
		controller: function($scope, $element) {
			$scope.searchProps = ['attributes.name'];
			$scope.sets = sets;
			$scope.onSelect = _onSelect;
			$scope.onRemove = _onRemove;
			updateModel();

			function updateModel() {
				var currentSetIds = sets.setIdsByCardId[$scope.suggestion.id];
				var currentSets = _.pick(sets.byId, currentSetIds);
				$scope.selectedSets = _.values(currentSets);
			}

			function _onSelect(set) {
				sets.addCardToSet($scope.suggestion, set)
				.then(updateModel);
			}

			function _onRemove(set) {
				sets.removeCardFromSet($scope.suggestion, set)
				.then(updateModel);
			}
		}
	}
});