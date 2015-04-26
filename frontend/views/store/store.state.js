'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('store', {
    url: '/store',
    description: 'The best place to buy God Hates Charades and all that other shit we make.',
    templateUrl: 'views/store/store.html',
    controller: 'storeView',
    resolve: {
      products: ['Restangular', function(Restangular) {
        return [{name: 'God Hates Charades'}];
      }]
    }
  });
});