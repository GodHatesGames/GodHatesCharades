'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('admin.export', {
    url: '/export',
    title: 'Export',
    templateUrl: 'views/export/export.html',
    resolve: {
      suggestions: ['Suggestion', function(Suggestion) {
        return Suggestion.getAllApprovedSuggestions();
      }],
      allSets: ['Set', 'suggestions', function(Set, suggestions) {
        return Set.getAllSetsAndItems();
      }]
    },
    controller: 'exportView'
  });
});