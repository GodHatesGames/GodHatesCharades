'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('timeline', {
    url: '/timeline',
    title: 'Timeline',
    description: 'See our progress in shipping the game to our kickstarter backers!',
    templateUrl: 'views/timeline/timeline.html',
    controller: 'timelineView',
    resolve: {
      timelineDoc: function(prismic) {
        return prismic.getDocumentById(CONFIG.PRISMIC.DOCS.PAGE_TIMELINE);
      }
    }
  });
});