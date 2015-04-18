'use strict';

angular.module('app')
.config(function ($stateProvider) {
	$stateProvider.state('admin.moderation', {
		url: '/moderation',
		title: 'Moderation',
		templateUrl: 'views/admin.moderation/admin.moderation.html',
		resolve: {
			unmoderated: ['Suggestion', function(Suggestion) {
				return Suggestion.getUnmoderatedSuggestions();
			}],
			approved: ['Suggestion', function(Suggestion) {
				return Suggestion.getAllApprovedSuggestions();
			}],
			sets: ['Set', function(Set) {
				return Set.findAll();
			}]
		},
		controller: 'moderationView'
	});
});