'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('store', {
    url: '/store',
    description: 'The best place to buy God Hates Charades and all that other shit we make.',
    templateUrl: 'views/store/store.html',
    controller: 'storeView',
    resolve: {
      collection: ['Restangular', function(Restangular) {
        return Restangular.all('store').one('collection', '31882561').getList();
      }],
      products: ['collection', 'Restangular', function(collection, Restangular) {
        var args = ['product'];
        Array.prototype.push.apply(args, _.pluck(collection, 'product_id'));
        var request = Restangular.all('store').several.apply(this, args);
        return request.getList();
      }]
    }
  });
});