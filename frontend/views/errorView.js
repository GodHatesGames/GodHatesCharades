'use strict';
app.controller('errorView', function($scope, $stateParams) {
	$scope.message = $stateParams.message;
});