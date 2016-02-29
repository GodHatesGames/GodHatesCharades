app.factory('StoreProduct', function (DS) {
  // vars
  var definition = {
    name: 'product',
    computed: {
      mainVariantBarcode: ['mainVariant', _updateMainVariantBarcode],
      mainVariantPrice: ['mainVariant', _updateMainVariantPrice],
      mainVariantOriginalPrice: ['mainVariant', _updateMainVariantOriginalPrice],
      mainVariantId: ['variants', _updateMainVariantId],
      mainVariant: ['variants', _updateMainVariant],
      cartClass: ['mainVariant', _updateCartClass],
      soldOut: ['mainVariant', _updateSoldOut],
      bundle: ['mainVariant', _updateBundle],
      name: ['mainVariant', _updateName]
    },
    relations: {
      belongsTo: {
        collection: {
          localKey: 'collection_id',
          localField: 'collection',
          parent: true
        }
      }
    },
    methods: {
      // Instance methods
    }
  }
  // init
  var StoreProduct = DS.defineResource(definition);

  return StoreProduct;

  // definition methods
  function _updateMainVariantId(variants) {
    if(variants.length === 1) {
      return variants[0].id;
    }
  }

  function _updateMainVariant(variants) {
    if(variants.length === 1) {
      return variants[0];
    }
  }

  function _updateMainVariantBarcode(mainVariant) {
    if(mainVariant) {
      return mainVariant.barcode;
    }
  }

  function _updateMainVariantPrice(mainVariant) {
    if(mainVariant) {
      return Number(mainVariant.price);
    }
  }

  function _updateMainVariantOriginalPrice(mainVariant) {
    if(mainVariant) {
      var originalPrice = Number(mainVariant.compare_at_price);
      return originalPrice > 0 ? originalPrice : null;
    }
  }
  
  // class methods
  function _updateCartClass(mainVariant) {
    switch(mainVariant.sku) {
      case '685450493604' :
        return 'product-main-game';
      case 'GAME-001-MC' :
        return 'product-main-game-wholesale';
      case '685450493611' :
        return 'product-expansion';
      case 'EXP-001-MC' :
        return 'product-expansion-wholesale';
      case 'BUN-003' :
        return 'product-BUN-003';
      default :
        return;
    }
  }

  function _updateSoldOut(mainVariant) {
    if(mainVariant.inventory_management === null) {
      return false;
    } else if(mainVariant.inventory_quantity > 0) {
      return false;
    } else {
      return true;
    }
  }

  function _updateBundle(mainVariant) {
    if(mainVariant.option2) {
      return mainVariant.option2.split(',');
    } else {
      return null;
    }
  }

  function _updateName(mainVariant) {
    if(mainVariant.option1) {
      return mainVariant.option1;
    } else {
      return '';
    }
  }

  // instance methods




});