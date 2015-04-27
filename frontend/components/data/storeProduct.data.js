app.factory('StoreProduct', function (DS) {
  // vars
  var definition = {
    name: 'product',
    afterInject: _afterInject,
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
  function _afterInject(resource, attrs) {
    // DS.loadRelations('product', attrs);
    console.log(resource);
    console.log(attrs);
  }

  // class methods

  // instance methods




});