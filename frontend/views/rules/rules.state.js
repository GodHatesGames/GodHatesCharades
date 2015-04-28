'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('rules', {
    url: '/rules',
    title: 'Rules',
    description: 'Learn the rules before your play the game.',
    templateUrl: 'views/rules/rules.html',
    controller: 'rulesView',
    resolve: {
      rulesDoc: function(prismic) {
        return prismic.getDocumentById(CONFIG.PRISMIC.DOCS.PAGE_RULES);
      }
    }
  });
});