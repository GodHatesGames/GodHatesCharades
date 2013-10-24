define([
	'angular',
	'app'
	], 
	function(angular, app) {

		app.directive('vote', [function() {
			return {
				restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
				templateUrl: 'components/vote.html',
				replace: true,
				link: function($scope, $element) {

				},
				controller: function($scope, $element) {
					$scope.zeroCards = [];
					var zeroLoaded = false;
					$scope.oneCards = [];
					var oneLoaded = false;
					$scope.loading = true;
					loadCards(0);
					loadCards(1);

					function loadCards(type) {
						var SuggestionObject = Parse.Object.extend("Suggestion");
						var query = new Parse.Query(SuggestionObject);
						query.limit(100);
						query.equalTo('type', type);
						query.ascending('updatedAt');
						// query.skip($scope.getSkip());
						query.find({
							success: onSuggestionsLoaded
						});
					}

					function onSuggestionsLoaded(suggestions) {
						if(suggestions.length > 0) {
							switch(suggestions[0].get('type')) {
								case 0 :
									$scope.zeroCards = suggestions;
									zeroLoaded = true;
									break;
								case 1 :
									$scope.oneCards = suggestions;
									oneLoaded = true;
							}
							if(zeroLoaded && oneLoaded)
								$scope.loading = false;
							$scope.$digest();
						} else {
							console.log('couldn\'t find any suggestions');
						}
					}

				}
			}
		}]);
	}
);