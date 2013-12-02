define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('userSubmissions', ['$filter', 'cardService', 'parseUser', function($filter, cardService, parseUser) {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/userSubmissions.html',
				replace: false,
				scope: {
					userid: '=userid'
				},
				link: function($scope, $element) {
					$scope.$watch('pairIndex', $scope.onPairIndexChanged);
				},
				controller: function($scope, $element) {
					// public vars
					$scope.pageSize = 50;
					$scope.loading = false;
					$scope.suggestions = [];
					$scope.skipIndex = 0; //TODO: make private
					$scope.allLoaded = false;
					$scope.loadSuggestions = loadSuggestions;
					$scope.reloadSuggestions = reloadSuggestions;
					$scope.tab = 'best';
					// Private methods

					function onUserFound(user) {
						$scope.user = user;
					}

					function onUserError(error) {
						$scope.error = true;
					}

					function reloadSuggestions(tab) {
						$scope.tab = tab;
						$scope.suggestions = [];
						$scope.skipIndex = 0;
						$scope.loadSuggestions();
					}

					function loadSuggestions() {
						if(!$scope.loading && !$scope.allLoaded) {
							$scope.loading = true;

							var Suggestion = Parse.Object.extend('Suggestion');
							var owner = new Parse.User();
							owner.id = $scope.userid;
							var query = new Parse.Query(Suggestion);
							query.descending('totalVotes');
							query.equalTo('owner', owner);
							query.include('owner');
							query.skip($scope.skipIndex);
							query.find({
								success: onSuggestionsLoaded,
								error: onSuggestionsError
							});
						}
					}

					function onSuggestionsLoaded(suggestions) {
						if(suggestions.length < $scope.pageSize) {
							$scope.allLoaded = true;
						}
						cardService.cache(suggestions);
						$scope.suggestions = $scope.suggestions.concat(suggestions);
						$scope.loading = false;
						$scope.skipIndex += suggestions.length;
						$scope.$digest();
					}

					function onSuggestionsError(error) {
						console.log('couldn\'t find any pairs:', error);
					}

					// init
					loadSuggestions();

					var promise = parseUser.getUserById($scope.userid);
					promise.then(onUserFound, onUserError);

				}
			}
		}]);
	}
);