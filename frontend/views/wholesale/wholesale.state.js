'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('wholesale', {
    url: '/wholesale',
    description: 'The best place to buy God Hates Charades in bulk.',
    templateUrl: 'views/wholesale/wholesale.html',
    controller: 'wholesaleView',
    resolve: {
      collection: ['products', 'StoreItemCollection', function(products, StoreItemCollection) {
        return StoreItemCollection.find('171177281');
      }],
      products: ['StoreProduct', function(StoreProduct) {
        return StoreProduct.findAll({
          collection_id: '171177281'
        });
      }],
      wholesaleDoc: function(prismic) {
        return prismic.getDocumentById(CONFIG.PRISMIC.DOCS.PAGE_WHOLESALE);
      }
    }
  });
});