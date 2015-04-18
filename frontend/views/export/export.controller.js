'use strict';
app.controller('exportView', function(suggestions, allSets, $scope, $filter, DS) {
	$scope.suggestions = suggestions;
	$scope.sets = allSets;
});