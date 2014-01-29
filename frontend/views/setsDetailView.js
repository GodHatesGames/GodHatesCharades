'use strict';
app.controller('setsDetailView', function(sets, $scope, $state, $stateParams, cardService) {
	$scope.saving = false;
	$scope.cardsLoading = true;
	$scope.cardService = cardService;
	$scope.set = sets.byId[$stateParams.id];
	$scope.setItems =[];
	$scope.setItemsByCardId = {};
	$scope.$on('suggestionAdded', onSuggestionAdded);
	console.log('set:', $scope.set);

	sets.getCardsForSet($scope.set)
	.then(function (setItems) {
		$scope.cardsLoading = false;
		$scope.setItems = setItems;
		$scope.setItemsByCardId = {};
		_.each(setItems, function(value, index, list) {
			$scope.setItemsByCardId[value.get('card').id] = value;
		});
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

	$scope.removeSetItem = function(setItem) {
		sets.removeSetItem(setItem)
		.then(function() {
			//remove setItem from the list of setItems
			var index = $scope.setItems.indexOf(setItem);
			$scope.setItems.splice(index, 1);
			delete $scope.setItemsByCardId[setItem.get('card').id];
		});
	};

	function onSuggestionAdded(event, suggestion) {
		if(!$scope.setItemsByCardId[suggestion.id]) {
			sets.addCardToSet(suggestion, $scope.set).
			then(function onSuccess(newSetItem) {
				// force the card data to avoid a reload
				newSetItem.attributes.card = suggestion;
				$scope.setItems.unshift(newSetItem);
				$scope.setItemsByCardId[suggestion.id] = newSetItem;
			});
		}
	}
});