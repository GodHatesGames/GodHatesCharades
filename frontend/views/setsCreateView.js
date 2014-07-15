'use strict';
app.controller('setsCreateView', function($scope, $state) {
	$scope.saving = false;
	$scope.createSet = function() {
		$scope.saving = true;

		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'createSet',
			{
				name: $scope.name
			},
			{
				success: onSuggestionsLoaded,
				error: onSuggestionsError
			}
		);

		function onSuggestionsLoaded(newSet) {
			console.log('newSet created');
			$scope.sets.data.push(newSet);
			$scope.sets.byId[newSet.id] = newSet;
			$state.go('admin.sets');
			$scope.saving = false;
		}

		function onSuggestionsError(err) {
			console.log('err creating set:', err);
			$scope.saving = false;
		}
	};
});