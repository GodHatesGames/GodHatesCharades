'use strict';
app.controller('suggestionsView', function(suggestions, setIdsByCardId, $scope, $modal, cardDetailsModal, Suggestion) {
	console.log('view loaded');
	$scope.suggestions = suggestions;
	$scope.SORT_TEXT = {
		descending: ['text'],
		ascending: ['-text']
	};
	$scope.SORT_TYPE = {
		descending: ['type'],
		ascending: ['-type']
	};
	$scope.SORT_AUTHOR = {
		descending: ['owner.name'],
		ascending: ['-owner.name']
	};
	$scope.SORT_VOTES = {
		descending: ['totalVotes'],
		ascending: ['-totalVotes']
	};
	$scope.SORT_SKIPS = {
		descending: ['skipped'],
		ascending: ['-skipped']
	};
	$scope.SORT_KDR = {
		descending: ['getKDR()'],
		ascending: ['-getKDR()']
	};
	$scope.SORT_VIEWS = {
		descending: ['getTotalViews()'],
		ascending: ['-getTotalViews()']
	};
	$scope.searchProps = ['text'];
	$scope.sortOverrideKeys;
	$scope.sortDirection;
	$scope.overrideSort = _overrideSort;
	$scope.getSortClass = _getSortClass;
	$scope.editSuggestion = _editSuggestion;
	$scope.cardDetailsModal = cardDetailsModal;

	// _.each(suggestions, function(suggestion) {
	// 	suggestion.updateLinks();
	// });

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
			suggestion.text = updatedSuggestion.attributes.text;
			suggestion.legal = updatedSuggestion.attributes.legal;
			// modalInstance.dismiss();
		}

		function _onEditError(err) {
			console.log('modal error', err);
			// modalInstance.dismiss();
		}
	}
});