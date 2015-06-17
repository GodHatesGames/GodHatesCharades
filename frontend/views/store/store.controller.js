'use strict';
app.controller('storeView', function(collection, products, $scope, $timeout, $window) {
  // private
  var _cart = [];
  var _collapsedCart = {};
  var MAX_ITEMS = 9;

  // public
  $scope.collection = collection;
  $scope.cart = _cart;
  $scope.collapsedCart = _collapsedCart;
  $scope.buyUrl = _buyUrl;
  $scope.decrement = _decrement;
  $scope.increment = _increment;
  $scope.getCountById = _getCountById;
  $scope.getProductLayer = _getProductLayer;
  $scope.getSway = _getSway;
  $scope.setQuantity = _setQuantity;
  $scope.maxCartMode = false;

  // Init

  // default to true so we can hack/preload the cart image
  $scope.isCartFull = true;
  $timeout(function() {
    $scope.isCartFull = false;
  }, 50);

  // methods
  function _updateCartMode() {
    if(_cart.length >= MAX_ITEMS && $scope.maxCartMode == false) {
      $scope.maxCartMode = true;
    } else if(_cart.length < MAX_ITEMS && $scope.maxCartMode == true) {
      $scope.maxCartMode = false;
    }
  }

  function _increment(product) {
    $scope.isCartFull = true;
    if(product.mainVariantId) {
      var item = _tempItem(product.mainVariantId);
      _cart.push(item);
      // update collapsed cart
      if(!_collapsedCart[product.mainVariantId]) {
        _collapsedCart[product.mainVariantId] = 1;
      } else {
        _collapsedCart[product.mainVariantId]++;
      }
    }
    _updateCartMode();
    if(!$scope.$$phase) {
      $scope.$digest();
    }
  }

  function _decrement(product) {
    if(product.mainVariantId) {
      var index = _.findLastIndex(_cart, function (item) {
        return item.variant == product.mainVariantId;
      });
      if(index > -1) {
        _cart.splice(index, 1);
      }

      // update collapsed cart
      if(_collapsedCart[product.mainVariantId] === 1) {
        delete _collapsedCart[product.mainVariantId];
      } else {
        _collapsedCart[product.mainVariantId]--;
      }
    }
    _updateCartMode();
    if(_cart.length === 0) {
      $scope.isCartFull = false;
    }
    if(!$scope.$$phase) {
      $scope.$digest();
    }
  }

  function _setQuantity (newQuantity, product) {
    var currentQuantity = _getCountById(product.mainVariantId);
    var diff = newQuantity - currentQuantity;
    var changeFunc = diff > 0 ? _increment : _decrement;
    var absDiff = Math.abs(diff);
    console.log(absDiff);

    _.times(absDiff, function(n) {
      console.log('times', n);
      _.delay(changeFunc, 10 * n, product);
    });
  }

  function _getSway() {
    // HACK: returning no sway until i can fix the skull-fuck situation
    return '';

    if(_cart.length > 5) {
      //sway big
      return 'sway-a-lot';
    } else {
      //no sway
      return '';
    }
  }

  function _tempItem(variant) {
    return {
      variant: variant,
      added: new Date().getTime()
    }
  }

  function _buyUrl() {
    var url = 'https://godhatesgames.myshopify.com/cart/';
    var itemsToAdd = [];
    _.each(_collapsedCart, function(quantity, itemId) {
      itemsToAdd.push(itemId + ':' + quantity);
    });
    var items = itemsToAdd.join(',');
    return url + items;
  }

  function _getCountById(id) {
    return _collapsedCart[id] || 0;
  }

  function _getProductLayer(index) {
    return {
      'z-index': _cart.length - index
    };
  }
});