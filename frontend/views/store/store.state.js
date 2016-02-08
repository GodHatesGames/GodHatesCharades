'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('store', {
    url: '/store',
    description: 'The best place to buy God Hates Charades and all that other shit we make.',
    templateUrl: 'views/store/store.html',
    controller: 'storeView',
    resolve: {
      collection: ['products', 'StoreItemCollection', function(products, StoreItemCollection) {
        return StoreItemCollection.find('31882561');
      }],
      products: ['StoreProduct', function(StoreProduct) {
        return StoreProduct.findAll({
          collection_id: '31882561'
        });
      }]
    }
  });
});