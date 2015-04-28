'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('admin.sets', {
		url: '/sets',
		title: 'Sets',
		templateUrl: 'views/admin.sets/admin.sets.html',
		resolve: {
			sets: function(Set) {
				return Set.findAll();
			},
			suggestions: function(Suggestion) {
				return Suggestion.getAllApprovedSuggestions();
			}
		},
		controller: 'setsView'
	});
});