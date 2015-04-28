app.factory('StoreProduct', function (DS) {
  // vars
  var definition = {
    name: 'product',
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
  
  // class methods

  // instance methods




});