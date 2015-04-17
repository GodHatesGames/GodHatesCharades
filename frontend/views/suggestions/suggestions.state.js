'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('admin.suggestions', {
		url: '/suggestions',
		title: 'Suggestions',
		templateUrl: 'views/suggestions/suggestions.html',
		resolve: {
			suggestions: ['Suggestion', function(Suggestion) {
				return Suggestion.getAllApprovedSuggestions();
			}],
			sets: ['Set', function(Set) {
				return Set.findAll();
			}]
		},
		controller: 'suggestionsView'
	});
});