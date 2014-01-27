'use strict';
app.controller('setsView', function(allSets, $scope) {
	$scope.sets = allSets.data;
});