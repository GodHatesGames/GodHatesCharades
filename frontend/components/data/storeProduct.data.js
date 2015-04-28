app.factory('StoreProduct', function (DS) {
  // vars
  var definition = {
    name: 'product',
    computed: {
      mainVariant: ['variants', _updateMainVariant]
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
  function _updateMainVariant(variants) {
    if(variants.length === 1) {
      return variants[0].id;
    }
  }
  
  // class methods

  // instance methods




});