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
			$scope.saving = false;
			$scope.feedbackClass = _feedbackClass;
			_updateModel();

			function _updateModel() {
				var currentSetIds = sets.setIdsByCardId[$scope.suggestion.id];
				var currentSets = _.pick(sets.byId, currentSetIds);
				$scope.selectedSets = _.values(currentSets);
			}

			function _onSelect(set) {
				$scope.saving = true;
				sets.addCardToSet($scope.suggestion, set)
				.then(_updateModel)
				.then(_onComplete);
			}

			function _onRemove(set) {
				$scope.saving = true;
				sets.removeCardFromSet($scope.suggestion, set)
				.then(_updateModel)
				.then(_onComplete);
			}

			function _onComplete() {
				$scope.saving = false;
			}

			function _feedbackClass() {
				return $scope.saving ? 'glyphicon-refresh custom-spin' : 'glyphicon-ok-circle';
			}
		}
	}
});