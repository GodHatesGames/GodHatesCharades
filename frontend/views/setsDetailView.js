'use strict';
app.controller('setsDetailView', function(sets, $scope, $state, $stateParams, cardService) {
	$scope.saving = false;
	$scope.cardsLoading = true;
	$scope.cardService = cardService;
	$scope.set = sets.byId[$stateParams.id];
	$scope.setItems =[];
	$scope.setItemsByCardId = {};
	$scope.setItemsByCardType = {
		0: [],
		1: []
	};
	$scope.$on('suggestionAdded', onSuggestionAdded);
	console.log('set:', $scope.set);

	sets.getCardsForSet($scope.set)
	.then(function (setItems) {
		$scope.cardsLoading = false;
		$scope.setItems = setItems;
		$scope.setItemsByCardId = {};
		_.each(setItems, function(value, index, list) {
			insertSetItem(value);
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
			var card = setItem.get('card');
			delete $scope.setItemsByCardId[card.id];
			var typeArr = $scope.setItemsByCardType[card.get('type')];
			var typeIndex = typeArr.indexOf(setItem);
			typeArr.splice(typeIndex, 1);
		});
	};

	function insertSetItem(setItem) {
		var card = setItem.get('card');
		$scope.setItemsByCardId[card.id] = setItem;
		var typeArr = $scope.setItemsByCardType[card.get('type')];
		typeArr.push(setItem);
	}

	function onSuggestionAdded(event, suggestion) {
		// if the card isn't already in the set, then created a new set item
		if(!$scope.setItemsByCardId[suggestion.id]) {
			sets.addCardToSet(suggestion, $scope.set).
			then(function onSuccess(newSetItem) {
				// force the card data to avoid a reload
				newSetItem.attributes.card = suggestion;
				insertSetItem(newSetItem);
			});
		}
	}
});