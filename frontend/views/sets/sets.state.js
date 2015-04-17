'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('admin.sets', {
		url: '/sets',
		title: 'Sets',
		templateUrl: 'views/sets/sets.html',
		resolve: {
			sets: ['Set', function(Set) {
				return Set.findAll();
			}],
			suggestions: ['Suggestion', function(Suggestion) {
				return Suggestion.getAllApprovedSuggestions();
			}]
		},
		controller: 'setsView'
	});
});