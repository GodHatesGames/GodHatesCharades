app.factory('StoreItemCollection', function (DS) {
  // vars
  var definition = {
    name: 'collection',
    endpoint: 'api/store/collection',
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




});