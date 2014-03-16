'use strict';
app.controller('exportView', function(getAllSuggestions, sets, $scope, $filter) {
	$scope.allSuggestions = getAllSuggestions.data;
	$scope.setItems = [];
	sets.getCardsForSet(sets.byId[CONFIG.PRINT_SET_ID])
	.then(function(setItems) {
		$scope.setItems = setItems;
	});
});