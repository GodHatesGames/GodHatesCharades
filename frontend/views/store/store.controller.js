'use strict';
app.controller('storeView', function(collection, products, $scope, $timeout, $window) {
  // private
  var _cart = [];
  var _collapsedCart = [];
  var _collapsedCartById = {};
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
      // update normal cart

      _cart.push(item);
      // update collapsed cart
      if(!_collapsedCartById[product.mainVariantId]) {
        var newCollapsedCartItem = {
          variant: product.mainVariantId,
          quantity: 1,
          added: new Date().getTime()
        };
        _collapsedCartById[product.mainVariantId] = newCollapsedCartItem;
        _collapsedCart.push(newCollapsedCartItem);
      } else {
        _collapsedCartById[product.mainVariantId].quantity++;
      }
    }
    _updateCartMode();
  }

  function _decrement(product) {
    if(product.mainVariantId) {
      var index = _.findLastIndex(_cart, function (item) {
        return item.variant == product.mainVariantId;
      });
      if(index > -1) {
        _cart.splice(index, 1);

        // update collapsed cart
        if(_collapsedCartById[product.mainVariantId].quantity === 1) {
          //update array
          var cartItemIndex = _collapsedCart.indexOf(_collapsedCartById[product.mainVariantId]);
          _collapsedCart.splice(cartItemIndex, 1);
          // update map
          delete _collapsedCartById[product.mainVariantId];
        } else {
          _collapsedCartById[product.mainVariantId].quantity--;
        }

      }
    }
    _updateCartMode();
    if(_cart.length === 0) {
      $scope.isCartFull = false;
    }
  }

  function _setQuantity (newQuantity, product) {
    var currentQuantity = _getCountById(product.mainVariantId);
    var diff = newQuantity - currentQuantity;
    var incrementing = diff > 0;
    var changeFunc = incrementing ? _increment : _decrement;
    var absDiff = Math.abs(diff);
    console.log(absDiff);
    var useDelay = true;
    if(absDiff < 20 || $scope.maxCartMode) {
      // useDelay = false;
    }

    _.times(absDiff, function(n) {
      console.log('times', n);
      if(useDelay && incrementing) {
        _.delay(function() {
          $scope.$apply(function() {
            changeFunc(product);
          });
        }, 10 * n);
      } else {
        changeFunc(product);
      }
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
    _.each(_collapsedCartById, function(cartItem, itemId) {
      itemsToAdd.push(itemId + ':' + cartItem.quantity);
    });
    var items = itemsToAdd.join(',');
    return url + items;
  }

  function _getCountById(id) {
    if(_collapsedCartById[id])
      return _collapsedCartById[id].quantity;
    else
      return 0;
  }

  function _getProductLayer(store, index) {
    return {
      'z-index': _.size(store) - index
    };
  }
});