app.controller('topView', function($scope, pairService, $filter, $state, parseUser) {
	// public vars
	$scope.pairService = pairService;
	$scope.pageSize = 51;
	$scope.loading = false;
	$scope.pairs = [];
	$scope.skipIndex = 0; //TODO: make private
	$scope.allLoaded = false;
	$scope.parseUser = parseUser;
	$scope.tab = 'best';
	$scope.sortPredicates = {
		best: ['-attributes.kdr',
		       '-chosen',
		       '-skipped'],
		worst: ['attributes.kdr',
		        '-skipped',
		        'chosen'],
		controversial: ['-controversy',
		                '-skipped',
		                '-chosen']
	}

	// Private methods

	$scope.reloadPairs = function(tab) {
		$scope.tab = tab;
	}


	$scope.loadPairs = function() {
		console.log($state.current.name);
		if(!$scope.loading && !$scope.allLoaded) {
			var options = {
				pageSize: $scope.pageSize,
				skipIndex: $scope.skipIndex,
				type: $scope.tab
			};
			var callbacks = {
				success: onPairsLoaded,
				error: onPairsError
			};
			$scope.loading = true;
			Parse.Cloud.run(CONFIG.PARSE_VERSION + 'topPairs', options, callbacks);
		}
	}

	function onPairsLoaded(pairs) {
		if(pairs.length < $scope.pageSize) {
			$scope.allLoaded = true;
		}
		$scope.pairs = $scope.pairs.concat(pairs);
		$scope.skipIndex += pairs.length;
		$scope.loading = false;
		$scope.$digest();
	}

	function onPairsError(error) {
		console.log('couldn\'t find any pairs:', error);
	}

	// // init
	$scope.loadPairs();
});