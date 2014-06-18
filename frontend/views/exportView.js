'use strict';
app.controller('exportView', function(getAllSuggestions, sets, $scope, $filter) {
	$scope.allSuggestions = getAllSuggestions.data;
	$scope.sets = sets;
});