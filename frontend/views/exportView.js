'use strict';
app.controller('exportView', function(sets, $scope, $filter) {
	sets.getCardsForSet(sets.byId[CONFIG.EXAMPLE_SET_ID])
	.then(function(setItems) {
		$scope.setItems = $filter('orderBy')(setItems, '-attributes.type');
	});
});