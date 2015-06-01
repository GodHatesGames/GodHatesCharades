app.factory('StoreItemCollection', function (DS) {
  // vars
  var definition = {
    name: 'collection',
    endpoint: 'api/store/collection',
    computed: {
      productsByMainVariant: ['items', _updateProducts]
    },
    relations: {
      hasMany: {
        storeItem: {
          localField: 'items',
          foreignKey: 'collection_id'
        }
      }
    },
    methods: {
      // Instance methods
    }
  }
  // init
  var StoreItemCollection = DS.defineResource(definition);

  return StoreItemCollection;

  // definition methods

  // class methods

  // instance methods
  function _updateProducts(items) {
    return _.indexBy(items, function(item) {
      return item.product.mainVariantId;
    });
  }




});