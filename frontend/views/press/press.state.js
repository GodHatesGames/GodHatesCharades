'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('press', {
    url: '/press',
    title: 'Press',
    description: 'Learn the press before your play the game.',
    templateUrl: 'views/press/press.html',
    controller: 'pressView',
    resolve: {
      pressDoc: function(prismic) {
        return prismic.getDocumentById(CONFIG.PRISMIC.DOCS.PAGE_PRESS);
      }
    }
  });
});