'use strict';
app.controller('storeView', function(collection, products, $scope, $timeout, $window) {
  // private
  var _cart = {};

  // public
  $scope.collection = collection;
  $scope.cart = _cart;
  $scope.countItems = _countItems;
  $scope.buyUrl = _buyUrl;
  $scope.decrement = _decrement;
  $scope.increment = _increment;

  // Init

  // default to true so we can hack/preload the cart image
  $scope.isCartFull = true;
  $timeout(function() {
    $scope.isCartFull = false;
  }, 50);

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
      if(_cart[product.mainVariant] > 0) {
        _cart[product.mainVariant]--;
      }
    }
  }

  function _countItems() {
    var count = 0;
    _.each(_cart, function(quantity) {
      count += quantity;
    });
    if(count > 0) {
      $scope.isCartFull = true;
    } else {
      $scope.isCartFull = false;
    }
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