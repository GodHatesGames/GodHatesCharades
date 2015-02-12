'use strict';
app.controller('moderationView', function(unmoderated, approved, sets, $scope, Suggestion, $compile, $rootScope) {
	// public vars
	$scope.index = 0;
	$scope.unmoderated = unmoderated;
	$scope.approved = approved;
	$scope.sets = sets;
	$scope.allApproved = false;
	$scope.errorMessage;
	$scope.suggestion = unmoderated[$scope.index];

	// Private methods
	function loadNext() {
		if($scope.index + 1 < unmoderated.length) {
			$scope.index++;
			$scope.suggestion = unmoderated[$scope.index];
		} else {
			$scope.allApproved = true;
		}
		if(!$rootScope.$$phase)
			$scope.$digest();
	}

	// Public Methods
	$scope.skip = function() {
		console.log('skip:', $scope.suggestion.id);
		loadNext();
	}

	$scope.approve = function() {
		var owner = $scope.suggestion.owner;
		var options = {
			card: {
				id: $scope.suggestion.id,
				text: $scope.suggestion.text,
				legal: $scope.suggestion.legal,
				url: $scope.suggestion.url
			},
			email: {
				subject: 'Thanks for submitting a card to God Hates Charades.',
				message: 'Your card was approved, it will now show up in voting! If everyone really likes it we\'ll put it in the game with your username on it.'
			},
			recipient: {
				address: owner.email,
				name: owner.name
			}
		};
		Parse.Cloud.run(CONFIG.PARSE_VERSION + 'approveSuggestion', options)
		.then(loadNext);
	}

	$scope.disapprove = function() {
		var owner = $scope.suggestion.owner;
		var options = {
			card: {
				id: $scope.suggestion.id,
				text: $scope.suggestion.text,
				legal: $scope.suggestion.legal,
				url: $scope.suggestion.url
			},
			email: {
				subject: 'Thanks for submitting a card to God Hates Charades.',
				message: 'Your card was not approved :( It\'s either a duplicate of an existing card or a card we think doesn\'t fit in the spirit of the game.'
			},
			recipient: {
				address: owner.email,
				name: owner.name
			}
		};
		Parse.Cloud.run(CONFIG.PARSE_VERSION + 'disapproveSuggestion', options)
		.then(loadNext);
	}
});