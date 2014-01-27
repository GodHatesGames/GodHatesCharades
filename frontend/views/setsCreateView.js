'use strict';
app.controller('setsCreateView', function($scope, $state) {
	$scope.saving = false;
	$scope.createSet = function() {
		$scope.saving = true;
		var Set = Parse.Object.extend('Set');
		var newSet = new Set();
		newSet.save({
			name: $scope.name
		})
		.then(function success(newSet) {
			console.log('newSet saved');
			$scope.sets.push(newSet);
			$state.go('admin.sets');
		},
		function error(err) {
			console.log('err saving set:', err);
		});
	};
});