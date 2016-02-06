'use strict';

var COLLECTION_ID = '31882561';
angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('product', {
    url: '/product/:handle',
    templateUrl: 'views/product/product.html',
    controller: 'productView',
    resolve: {
      products: function(StoreProduct) {
        return StoreProduct.findAll({
          collection_id: COLLECTION_ID
        });
      },
      collection: ['products', 'StoreItemCollection', function(products, StoreItemCollection) {
        return StoreItemCollection.find(COLLECTION_ID);
      }],
      product: function(products, StoreProduct, $stateParams) {
        // return StoreProduct.find($stateParams.handle);
        var products = StoreProduct.filter({
          where: {
            handle: $stateParams.handle
          }
        });

        return products[0];
      }
    }
  });
});