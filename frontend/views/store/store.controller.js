'use strict';
app.controller('storeView', function(collection, products, $scope) {
  // private
  var _cart = {};

  // public
  $scope.collection = collection;
  $scope.cart = _cart;
  $scope.countItems = _countItems;
  $scope.buyUrl = _buyUrl;
  $scope.decrement = _decrement;
  $scope.increment = _increment;

  // methods
  function _increment(product) {
    if(product.mainVariant) {
      if(!_cart[product.mainVariant]) {
        _cart[product.mainVariant] = 1;
      } else {
        _cart[product.mainVariant]++;
      }
    }
  }

  function _decrement(product) {
    if(product.mainVariant) {
      if(_cart[product.mainVariant] === 1) {
        delete _cart[product.mainVariant];
      } else {
        _cart[product.mainVariant]--;
      }
    }
  }

  function _countItems() {
    var count = 0;
    _.each(_cart, function(quantity) {
      count += quantity;
    });
    return count;
  }

  function _buyUrl() {
    var url = 'https://godhatesgames.myshopify.com/cart/';
    var itemsToAdd = [];
    _.each(_cart, function(quantity, key) {
      itemsToAdd.push(key + ':' + quantity);
    });
    var items = itemsToAdd.join(',');
    return url + items;
  }
});