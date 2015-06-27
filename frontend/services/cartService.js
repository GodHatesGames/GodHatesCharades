app.service('cartService', function($q, DSCacheFactory, ParseData, Pair, $interval) {
   // private
  var _items,_variants, _variantsById;

  // expires in 1 day
  var cartCache = DSCacheFactory('cart', {
    maxAge: 86400000
  });
  var existingCart = cartCache.get('cart');
  if(existingCart) {
    _items = existingCart.items;
    _variants = existingCart.variants;
    _variantsById = _.indexBy(_variants, 'id');
  } else {
    _items = [];
    _variants = [];
    _variantsById = {};
  }
  var MAX_ITEMS = 9;
  
  var Cart = {
    increment: _increment,
    decrement: _decrement,
    setQuantity: _setQuantity,
    getCountById: _getCountById,
    items: _items,
    variants: _variants,
    variantsById: _variantsById,
    maxCartMode: false,
    empty: _items.length === 0,
    max: MAX_ITEMS
  };
  _updateCartMode();

  var _updateCartCache = _.throttle(function() {
    var cart = _.pick(Cart, ['items', 'variants']);
    cartCache.put('cart', cart);
  }, 500);

  // methods
  function _updateCartMode() {
    if(_items.length >= MAX_ITEMS && Cart.maxCartMode == false) {
      Cart.maxCartMode = true;
    } else if(_items.length < MAX_ITEMS && Cart.maxCartMode == true) {
      Cart.maxCartMode = false;
    }
  }

  function _increment(product) {
    Cart.empty = false;
    if(product.mainVariantId) {
      var item = _tempItem(product.mainVariantId);
      // update normal cart

      _items.push(item);
      // update collapsed cart
      if(!_variantsById[product.mainVariantId]) {
        var newCollapsedCartItem = {
          id: product.mainVariantId,
          quantity: 1,
          added: new Date().getTime()
        };
        _variantsById[product.mainVariantId] = newCollapsedCartItem;
        _variants.push(newCollapsedCartItem);
      } else {
        _variantsById[product.mainVariantId].quantity++;
      }
    }
    _updateCartMode();
    _updateCartCache();
  }

  function _decrement(product) {
    if(product.mainVariantId) {
      var index = _.findLastIndex(_items, function (item) {
        return item.variant == product.mainVariantId;
      });
      if(index > -1) {
        _items.splice(index, 1);

        // update collapsed cart
        if(_variantsById[product.mainVariantId].quantity === 1) {
          //update array
          var cartItemIndex = _variants.indexOf(_variantsById[product.mainVariantId]);
          _variants.splice(cartItemIndex, 1);
          // update map
          delete _variantsById[product.mainVariantId];
        } else {
          _variantsById[product.mainVariantId].quantity--;
        }

      }
    }
    _updateCartMode();
    _updateCartCache();
    if(_items.length === 0) {
      Cart.empty = true;
    }
  }

  function _setQuantity (newQuantity, product) {
    var currentQuantity = _getCountById(product.mainVariantId);
    var diff = newQuantity - currentQuantity;
    var incrementing = diff > 0;
    var changeFunc = incrementing ? _increment : _decrement;
    var absDiff = Math.abs(diff);
    var delay = 10;
    if(absDiff < 20 || Cart.maxCartMode) {
      delay = 1;
    }

    // execute the functions X times to allow animation to run for each
    var qInterval = $interval(function() {
      absDiff--;
      changeFunc(product);
      if(absDiff === 0) {
        $interval.cancel(qInterval);
      }
    }, delay);
  }

  function _tempItem(variantId) {
    return {
      variant: variantId,
      added: new Date().getTime()
    }
  }

  function _getCountById(id) {
    if(_variantsById[id])
      return _variantsById[id].quantity;
    else
      return 0;
  }

  return Cart;
});