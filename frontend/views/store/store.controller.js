'use strict';
app.controller('storeView', function(collection, products, $scope, $timeout, $window) {
  // private
  var _cart = [];

  // public
  $scope.collection = collection;
  $scope.cart = _cart;
  // $scope.countItems = _countItems;
  $scope.buyUrl = _buyUrl;
  $scope.decrement = _decrement;
  $scope.increment = _increment;
  $scope.getCountById = _getCountById;
  $scope.getProductLayer = _getProductLayer;

  // Init

  // default to true so we can hack/preload the cart image
  $scope.isCartFull = true;
  $timeout(function() {
    $scope.isCartFull = false;
  }, 50);

  // methods
  function _increment(product) {
    $scope.isCartFull = true;
    if(product.mainVariantId) {
      _cart.unshift(product.mainVariantId);
    }
  }

  function _decrement(product) {
    if(product.mainVariantId) {
      var index = _.indexOf(_cart, product.mainVariantId);
      _cart.splice(index, 1);
    }
    if(_cart.length === 0) {
      $scope.isCartFull = false;
    }
  }

  function _buyUrl() {
    var url = 'https://godhatesgames.myshopify.com/cart/';
    var itemsToAdd = [];
    var counts = _.countBy(_cart);
    _.each(counts, function(quantity, id) {
      itemsToAdd.push(id + ':' + quantity);
    });
    var items = itemsToAdd.join(',');
    return url + items;
  }

  function _getCountById(id) {
    var count = 0;
    _.each(_cart, function(cartItem) {
      if(id === cartItem)
        count++;
    });
  }

  function _getProductLayer(index) {
    return {
      'z-index': _cart.length - index
    };
  }
});