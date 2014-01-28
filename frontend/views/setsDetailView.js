'use strict';
app.controller('setsDetailView', function(sets, $scope, $state, $stateParams, cardService) {
	$scope.saving = false;
	$scope.cardService = cardService;
	$scope.set = sets.byId[$stateParams.id];
	console.log('set:', $scope.set);

	sets.getCardsForSet($scope.set)
	.then(function (setItems) {
		$scope.setItems = setItems;
	});

	$scope.deleteSet = function() {
		$scope.saving = true;
		sets.deleteSet($scope.set)
		.then(function success() {
			$scope.saving = false;
			console.log('newSet deleted');
			$state.go('admin.sets');
		},
		function error(err) {
			$scope.saving = false;
			console.log('err saving set:', err);
		});
	};
});