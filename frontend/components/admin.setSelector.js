app.directive('setSelector', function(Set, SetItem) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/admin.setSelector.html',
		replace: true,
		scope: {
			suggestion: '=suggestion',
			sets: '=sets'
		},
		controller: function($scope, $element) {
			$scope.searchProps = ['name'];
			$scope.onSelect = _onSelect;
			$scope.onRemove = _onRemove;
			$scope.saving = false;
			$scope.feedbackClass = _feedbackClass;

			function _onSelect(set) {
				$scope.saving = true;
				SetItem.create({
					set: set,
					card: $scope.suggestion
				})
				.then(_onComplete);
			}

			function _onRemove(set) {
				$scope.saving = true;
				var setItem = _.findWhere($scope.suggestion.setItems, {ownerId: set.id});
				SetItem.destroy(setItem.id)
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