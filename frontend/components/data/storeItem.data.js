app.factory('StoreItem', function (DS) {
  // vars
  var definition = {
    name: 'storeItem',
    beforeInject: _beforeInject,
    findHasOne: true,
    computed: {
      product: ['product_id', _updateProduct]
    },
    methods: {
      // Instance methods
    }
  }
  // init
  var StoreItem = DS.defineResource(definition);

  return StoreItem;

  // definition methods
  function _beforeInject(resource, attrs) {
    console.log(resource);
    console.log(attrs);
  }

  function _updateProduct(product_id) {
    if(product_id)
      return DS.get('product', product_id);
  }

  // class methods

  // instance methods




});