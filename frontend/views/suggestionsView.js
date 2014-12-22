'use strict';
app.controller('suggestionsView', function(suggestions, allSets, setIdsByCardId, $scope, cardService, $modal, sets) {
	$scope.suggestions = suggestions.data;
	$scope.sets = sets;
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
	$scope.SORT_VOTES = {
		descending: ['attributes.totalVotes'],
		ascending: ['-attributes.totalVotes']
	};
	$scope.SORT_SKIPS = {
		descending: ['attributes.skipped'],
		ascending: ['-attributes.skipped']
	};
	$scope.SORT_KDR = {
		descending: ['cardService(attributes.totalVotes, attributes.skipped)'],
		ascending: ['-cardService(attributes.totalVotes, attributes.skipped)']
	};
	$scope.searchProps = ['attributes.text'];
	$scope.sortOverrideKeys;
	$scope.sortDirection;
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
			// assigned descending sort order to alpha and ascending as default to numerical
			if(type === $scope.SORT_TEXT || type === $scope.SORT_AUTHOR) {
				$scope.sortDirection = 'descending';
			} else {
				$scope.sortDirection = 'ascending';
			}

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
			templateUrl: 'components/cardDetails.modal.html',
			scope: modalScope,
			size: 'lg'
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