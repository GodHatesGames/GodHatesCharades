'use strict';
app.controller('suggestionsView', function(suggestions, sets, $scope, $modal, Suggestion) {
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
		descending: ['votes'],
		ascending: ['-votes']
	};
	$scope.SORT_SKIPS = {
		descending: ['skips'],
		ascending: ['-skips']
	};
	$scope.SORT_KDR = {
		descending: ['kdr'],
		ascending: ['-kdr']
	};
	$scope.SORT_VIEWS = {
		descending: ['views'],
		ascending: ['-views']
	};
	var DEFAULT_LIMIT = 10;
	var LOAD_LIMIT = 1;
	$scope.extras = _.range(DEFAULT_LIMIT);
	$scope.list = {
		search: null,
		limit: DEFAULT_LIMIT,
		searchProps: ['text'],
		sortDirection: null,
		sortOverrideKeys: null
	}
	$scope.overrideSort = _overrideSort;
	$scope.getSortClass = _getSortClass;
	$scope.editSuggestion = _editSuggestion;
	$scope.loadSuggestions = _loadSuggestions;
	$scope.$watch('list.search', _onSelectorUpdated);

	function _onSelectorUpdated(newValue) {
		if($scope.list.limit > DEFAULT_LIMIT) {
			$scope.list.limit = DEFAULT_LIMIT;
		}
	}

	function _isAlphaSort(type) {
		return type === $scope.SORT_TEXT || type === $scope.SORT_AUTHOR;
	}

	function _overrideSort(type) {
		$scope.list.limit = DEFAULT_LIMIT;
		if($scope.list.sortOverrideKeys && $scope.list.sortOverrideKeys === type) {
			// flip order if necessary
			if($scope.list.sortDirection === 'descending')
				$scope.list.sortDirection = 'ascending';
			else
				$scope.list.sortDirection = 'descending';
		} else {
			// assigned descending sort order to alpha and ascending as default to numerical
			if(_isAlphaSort(type)) {
				$scope.list.sortDirection = 'descending';
			} else {
				$scope.list.sortDirection = 'ascending';
			}

			// assign new type
			$scope.list.sortOverrideKeys = type;
		}

	}

	function _getSortClass(type) {
		var isDescending = $scope.list.sortDirection === 'descending';
		var sortClass = '';
		if(_isAlphaSort(type)) {
			sortClass =  isDescending ? 'glyphicon glyphicon-sort-by-alphabet' : 'glyphicon glyphicon-sort-by-alphabet-alt';
		} else {
			sortClass = isDescending ? 'glyphicon glyphicon glyphicon-sort-by-attributes' : 'glyphicon glyphicon-sort-by-attributes-alt';
		}
		if(type != $scope.list.sortOverrideKeys) {
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

	function _loadSuggestions() {
		$scope.list.limit += LOAD_LIMIT;
	}
});