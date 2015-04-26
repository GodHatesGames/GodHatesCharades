'use strict';
app.controller('storeView', function(collection, products, $scope) {
  $scope.collection = collection;
  $scope.productsById = _.indexBy(products, 'id');
});