'use strict';
app.controller('exportView', function(sets, $scope, $filter) {
	sets.getCardsForSet(sets.byId[CONFIG.PRINT_SET_ID])
	.then(function(setItems) {
		$scope.setItems = setItems;
	});
});