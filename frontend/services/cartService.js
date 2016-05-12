app.service('cartService', function($q, DSCacheFactory, ParseData, Pair, $interval, StoreProduct, $timeout, $rootScope) {
  var _carts = {};
  var DEFAULT_MAX_ITEMS = 12;
  
  // expires in 1 day
  var cartCache = DSCacheFactory('carts', {
    maxAge: 86400000
  });

  var _updateCartCache = _.throttle(function() {
    var cart = _.pick(this, ['items', 'variants']);
    cartCache.put(this.name, cart);
  }, 500);

  var existingCarts = cartCache.keys();
  if(existingCarts) {
    _.each(existingCarts, function(cartKey) {
      var existingCart = cartCache.get(cartKey);
      _buildCart(cartKey, existingCart);
    });
  }

  // Define Cart public
  
  var Cart = {
    getCart: _getCart
  };

  // methods

  function _buildCart(key, defaults) {
    // assign defaults if needed
    var cart = _.assign({
      maxItems: DEFAULT_MAX_ITEMS,
      items: [],
      variants: []
    }, defaults);

    // assign internal props and values
    cart.name = key;
    cart.maxCartMode = false;
    cart.variantsById = _.indexBy(cart.variants, 'id');
    cart.buyUrl = '';
    cart.empty = cart.items.length === 0 ? true : false;
    cart.increment = _increment;
    cart.decrement = _decrement;
    cart.setQuantity = _setQuantity;
    cart.getCountById = _getCountById;
    cart.getTotal = _getTotal;
    cart._updateCartMode = _updateCartMode;
    cart._updateBuyUrl = _updateBuyUrl;
    cart._updateCartCache = _updateCartCache;

    cart._updateCartMode();
    cart._updateBuyUrl();

    _carts[key] = cart;
    return cart;
  }

  function _getCart(key) {
    var cart = _carts[key];
    if(cart) {
      return cart;
    } else {
      return _buildCart(key);
    }
  }

  function _updateCartMode(key) {
    if(this.items.length >= this.maxItems) {
      this.maxCartMode = true;
    } else if(this.items.length < this.maxItems) {
      this.maxCartMode = false;
    }
  }

  function _increment(product) {
    this.empty = false;
    if(product.mainVariantId) {
      var item = _tempItem(product.mainVariantId);
      // update normal cart

      this.items.push(item);
      // update collapsed cart
      if(!this.variantsById[product.mainVariantId]) {
        var newVariantItem = {
          id: product.mainVariantId,
          quantity: 1,
          added: new Date().getTime(),
          price: product.mainVariantPrice
        };
        this.variantsById[product.mainVariantId] = newVariantItem;
        this.variants.push(newVariantItem);
      } else {
        this.variantsById[product.mainVariantId].quantity++;
      }
    }
    this._updateCartMode();
    this._updateBuyUrl();
    this._updateCartCache();
  }

  function _decrement(product) {
    if(product.mainVariantId) {
      var index = _.findLastIndex(this.items, function (item) {
        return item.variant == product.mainVariantId;
      });
      if(index > -1) {
        this.items.splice(index, 1);

        // update collapsed cart
        if(this.variantsById[product.mainVariantId].quantity === 1) {
          //update array
          var cartItemIndex = this.variants.indexOf(this.variantsById[product.mainVariantId]);
          this.variants.splice(cartItemIndex, 1);
          // update map
          delete this.variantsById[product.mainVariantId];
        } else {
          this.variantsById[product.mainVariantId].quantity--;
        }

      }
    }
    this._updateCartMode();
    this._updateBuyUrl();
    this._updateCartCache();
    if(this.items.length === 0) {
      $timeout(function() {
        this.empty = true;
      }.bind(this), 250);
    }
  }

  function _setQuantity (newQuantity, product) {
    var currentQuantity = this.getCountById(product.mainVariantId);
    var diff = newQuantity - currentQuantity;
    var incrementing = diff > 0;
    var changeFunc = incrementing ? this.increment.bind(this) : this.decrement.bind(this);
    var absDiff = Math.abs(diff);
    var delay = 10;
    if(absDiff < 20 || this.maxCartMode) {
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
    if(this.variantsById[id])
      return this.variantsById[id].quantity;
    else
      return 0;
  }

  function _getTotal() {
    var total = 0;
    _.each(this.variants, function(variant) {
      total += variant.quantity * variant.price;
    });
    return total;
  }

  function _updateBuyUrl() {
    var url = 'https://godhatesgames.myshopify.com/cart/';
    var itemsToAdd = [];
    _.each(this.variantsById, function(variant, itemId) {
      itemsToAdd.push(itemId + ':' + variant.quantity);
    });
    var items = itemsToAdd.join(',');
    this.buyUrl = url + items;
  }

  return Cart;
});