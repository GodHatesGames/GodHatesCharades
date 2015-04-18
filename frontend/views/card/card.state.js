'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('card', {
		url: '/card/:cardid/:slug',
		templateUrl: 'views/card/card.html',
		controller: 'cardView',
		resolve: {
			suggestion: ['Suggestion', '$stateParams', function(Suggestion, $stateParams) {
				return Suggestion.find($stateParams.cardid);
			}]
		}
	});
});