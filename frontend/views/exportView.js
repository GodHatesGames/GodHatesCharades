'use strict';
app.controller('exportView', function(suggestions, allSets, $scope, $filter, DS) {
	$scope.allSuggestions = suggestions;
	$scope.sets = allSets;
});