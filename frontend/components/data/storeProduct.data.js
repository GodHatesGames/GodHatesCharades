app.factory('StoreProduct', function (DS) {
  // vars
  var definition = {
    name: 'product',
    computed: {
      mainVariantPrice: ['mainVariant', _updateMainVariantPrice],
      mainVariantOriginalPrice: ['mainVariant', _updateMainVariantOriginalPrice],
      mainVariantId: ['variants', _updateMainVariantId],
      mainVariant: ['variants', _updateMainVariant],
      cartClass: ['mainVariant', _updateCartClass]
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
      case 'GAME-001' :
        return 'product-main-game';
      case 'EXP-001' :
        return 'product-expansion';
      case 'BUN-003' :
        return 'product-BUN-003';
      default :
        return;
    }
  }

  // instance methods




});