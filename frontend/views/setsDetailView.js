'use strict';
app.controller('setsDetailView', function(sets, $scope, $state, $stateParams, cardService) {
	$scope.saving = false;
	$scope.cardsLoading = true;
	$scope.cardService = cardService;
	$scope.set = sets.byId[$stateParams.id];
	$scope.setItems =[];
	$scope.$on('suggestionAdded', onSuggestionAdded);
	console.log('set:', $scope.set);

	sets.getCardsForSet($scope.set)
	.then(function (setItems) {
		$scope.cardsLoading = false;
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

	function onSuggestionAdded(event, suggestion) {
		sets.addCardToSet(suggestion, $scope.set).
		then(function onSuccess(newSetItem) {
			// force the card data to avoid a reload
			newSetItem.attributes.card = suggestion;
			$scope.setItems.unshift(newSetItem);
		});
	}
});