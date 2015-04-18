'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('blog.detail', {
    type: 'article',
    url: '/:id/:slug',
    templateUrl: 'views/blog.detail/blog.detail.html',
    resolve: {
      post: ['$stateParams', 'prismic', function($stateParams, prismic) {
        return prismic.getDocumentById($stateParams.id);
      }]
    },
    controller: 'blogDetailView'
  });
});