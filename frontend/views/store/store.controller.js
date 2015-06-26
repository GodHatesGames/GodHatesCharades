'use strict';
app.controller('storeView', function(collection, products, $scope, $timeout, $window, cart) {
  // public
  $scope.collection = collection;
  $scope.cart = cart;
  $scope.buyUrl = _buyUrl;
  $scope.getProductLayer = _getProductLayer;
  $scope.getSway = _getSway;

  // Init

  // default to true so we can hack/preload the cart image
  cart.empty = false;
  $timeout(function() {
    cart.empty = true;
  }, 50);

  function _getSway() {
    // HACK: returning no sway until i can fix the skull-fuck situation
    return '';

    if(cart.items.length > 5) {
      //sway big
      return 'sway-a-lot';
    } else {
      //no sway
      return '';
    }
  }

  function _buyUrl() {
    var url = 'https://godhatesgames.myshopify.com/cart/';
    var itemsToAdd = [];
    _.each(cart.variantsById, function(variant, itemId) {
      itemsToAdd.push(itemId + ':' + variant.quantity);
    });
    var items = itemsToAdd.join(',');
    return url + items;
  }

  function _getProductLayer(store, index) {
    return {
      'z-index': _.size(store) - index
    };
  }
});