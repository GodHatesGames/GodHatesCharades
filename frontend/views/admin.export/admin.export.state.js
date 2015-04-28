'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('admin.export', {
    url: '/export',
    title: 'Export',
    templateUrl: 'views/admin.export/admin.export.html',
    resolve: {
      suggestions: function(Suggestion) {
        return Suggestion.getAllApprovedSuggestions();
      },
      allSets: function(Set, suggestions) {
        return Set.getAllSetsAndItems();
      }
    },
    controller: 'exportView'
  });
});