'use strict';
app.controller('suggestionsView', function(suggestions, allSets, $scope, cardService) {
	$scope.suggestions = suggestions.data;
	$scope.allSets = allSets;
	$scope.cardService = cardService;
	$scope.SORT_TEXT = {
		descending: ['attributes.text'],
		ascending: ['-attributes.text']
	};
	$scope.SORT_TYPE = {
		descending: ['attributes.type'],
		ascending: ['-attributes.type']
	};
	$scope.SORT_AUTHOR = {
		descending: ['attributes.owner.attributes.name'],
		ascending: ['-attributes.owner.attributes.name']
	};
	$scope.searchProps = ['attributes.text'];
	$scope.sortOverrideKeys = null;
	$scope.sortDirection = 'descending';
	$scope.overrideSort = _overrideSort;
	$scope.getSortClass = _getSortClass;
	$scope.editSuggestion = _editSuggestion;

	function _overrideSort(type) {
		if($scope.sortOverrideKeys && $scope.sortOverrideKeys === type) {
			// flip order if necessary
			if($scope.sortDirection === 'descending')
				$scope.sortDirection = 'ascending';
			else
				$scope.sortDirection = 'descending';
		} else {
			// assigned descending sort order
			$scope.sortDirection = 'descending';
			// assign new type
			$scope.sortOverrideKeys = type;
		}

	}

	function _getSortClass(type) {
		if($scope.sortOverrideKeys && type === $scope.sortOverrideKeys) {
			var descending = $scope.sortDirection === 'descending';
			switch(type) {
				case $scope.SORT_TEXT :
				case $scope.SORT_AUTHOR :
					return descending ? 'glyphicon glyphicon-sort-by-alphabet' : 'glyphicon glyphicon-sort-by-alphabet-alt';
				default :
					return descending ? 'glyphicon glyphicon glyphicon-sort-by-attributes' : 'glyphicon glyphicon-sort-by-attributes-alt';
			}
		} else {
			return;
		}
	}

	function _editSuggestion(isolatedScope, suggestion) {
		var modalScope = $scope.$new(true);
		modalScope.suggestion = suggestion;
		modalScope.onSuccess = _onEditSuccess;
		modalScope.onError = _onEditError;

		var modalInstance = $modal.open({
			templateUrl: 'components/cardForm.modal.html',
			scope: modalScope,
			size: 'sm'
		})

		function _onEditSuccess() {
			console.log('modal success');
			modalInstance.dismiss();
		}

		function _onEditError(err) {
			console.log('modal error');
			modalInstance.dismiss();
		}
	}
});