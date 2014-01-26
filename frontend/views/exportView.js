'use strict';
app.controller('exportView', function(allSuggestions, $scope) {
	$scope.suggestions = allSuggestions.data;
});