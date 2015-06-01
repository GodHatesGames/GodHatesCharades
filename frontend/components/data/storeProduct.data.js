app.factory('StoreProduct', function (DS) {
  // vars
  var definition = {
    name: 'product',
    computed: {
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
  
  // class methods
  function _updateCartClass(mainVariant) {
    switch(mainVariant.sku) {
      case 'GAME-001' :
        return 'product-main-game';
      case 'EXP-001' :
        return 'product-expansion';
      default :
        return;
    }
  }

  // instance methods




});