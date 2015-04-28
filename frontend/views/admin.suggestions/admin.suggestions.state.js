'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('admin.suggestions', {
		url: '/suggestions',
		title: 'Suggestions',
		templateUrl: 'views/admin.suggestions/admin.suggestions.html',
		resolve: {
			suggestions: function(Suggestion) {
				return Suggestion.getAllApprovedSuggestions();
			},
			sets: function(Set) {
				return Set.findAll();
			}
		},
		controller: 'suggestionsView'
	});
});