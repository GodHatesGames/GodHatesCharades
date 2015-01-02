app.directive('setSelector', function(parseUser, pairService, $rootScope, Set, SetItem) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/setSelector.html',
		replace: true,
		scope: {
			suggestion: '=suggestion'
		},
		controller: function($scope, $element) {
			$scope.searchProps = ['name'];
			$scope.onSelect = _onSelect;
			$scope.onRemove = _onRemove;
			$scope.saving = false;
			$scope.feedbackClass = _feedbackClass;
			$scope.sets = [];
			$scope.updates = {
				sets: []
			};
			Set.findAll()
			.then(_onSetsFound)
			.then(_updateModel);

			function _onSetsFound(sets) {
				$scope.sets = sets;
			}

			function _updateModel() {
				var newSets = _.pluck($scope.suggestion.setItems, 'owner');
				$scope.updates.sets.length = 0;
				Array.prototype.push.apply($scope.updates.sets, newSets);
			}

			function _onSelect(set) {
				$scope.saving = true;
				set.addCard($scope.suggestion)
				.then(_updateModel)
				.then(_onComplete);
			}

			function _onRemove(set) {
				$scope.saving = true;
				var setItem = _.findWhere($scope.suggestion.setItems, {ownerId: set.id});
				SetItem.destroy(setItem.id)
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