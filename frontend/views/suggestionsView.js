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
		descending: ['getKDR()'],
		ascending: ['-getKDR()']
	};
	$scope.SORT_VIEWS = {
		descending: ['getTotalViews()'],
		ascending: ['-getTotalViews()']
	};
	$scope.searchProps = ['attributes.text'];
	$scope.sortOverrideKeys;
	$scope.sortDirection;
	$scope.overrideSort = _overrideSort;
	$scope.getSortClass = _getSortClass;
	$scope.editSuggestion = _editSuggestion;

	function _isAlphaSort(type) {
		return type === $scope.SORT_TEXT || type === $scope.SORT_AUTHOR;
	}

	function _overrideSort(type) {
		if($scope.sortOverrideKeys && $scope.sortOverrideKeys === type) {
			// flip order if necessary
			if($scope.sortDirection === 'descending')
				$scope.sortDirection = 'ascending';
			else
				$scope.sortDirection = 'descending';
		} else {
			// assigned descending sort order to alpha and ascending as default to numerical
			if(_isAlphaSort(type)) {
				$scope.sortDirection = 'descending';
			} else {
				$scope.sortDirection = 'ascending';
			}

			// assign new type
			$scope.sortOverrideKeys = type;
		}

	}

	function _getSortClass(type) {
		var isDescending = $scope.sortDirection === 'descending';
		var sortClass = '';
		if(_isAlphaSort(type)) {
			sortClass =  isDescending ? 'glyphicon glyphicon-sort-by-alphabet' : 'glyphicon glyphicon-sort-by-alphabet-alt';
		} else {
			sortClass = isDescending ? 'glyphicon glyphicon glyphicon-sort-by-attributes' : 'glyphicon glyphicon-sort-by-attributes-alt';
		}
		if(type != $scope.sortOverrideKeys) {
			sortClass += ' invisible';
		}

		return sortClass;
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

		function _onEditSuccess(updatedSuggestion) {
			console.log('modal success');
			suggestion.attributes.text = updatedSuggestion.attributes.text;
			suggestion.attributes.legal = updatedSuggestion.attributes.legal;
			// modalInstance.dismiss();
		}

		function _onEditError(err) {
			console.log('modal error');
			// modalInstance.dismiss();
		}
	}
});