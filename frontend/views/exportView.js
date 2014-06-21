'use strict';
app.controller('exportView', function(getAllSuggestions, allSets, $scope, $filter) {
	$scope.allSuggestions = getAllSuggestions.data;
	$scope.sets = allSets;
});