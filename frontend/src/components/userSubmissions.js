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
					$scope.loading = true;
					$scope.suggestions = [];
					$scope.pairIndex = 0;

					// Private methods

					function onUserFound(user) {
						$scope.user = user;
						// $scope.$digest();
					}

					function onUserError(error) {
						$scope.error = true;
						// $scope.$digest();
					}

					function loadSuggestions() {
						$scope.loading = true;

						var Suggestion = Parse.Object.extend("Suggestion");
						var owner = new Parse.User();
						owner.id = $scope.userid;
						var query = new Parse.Query(Suggestion);
						query.descending('totalVotes');
						query.equalTo("owner", owner);
						query.include('owner');
						query.find({
							success: onSuggestionsLoaded,
							error: onSuggestionsError
						});
						
					}

					function onSuggestionsLoaded(suggestions) {
						cardService.cache(suggestions);
						$scope.suggestions = $scope.suggestions.concat(suggestions);
						$scope.loading = false;
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