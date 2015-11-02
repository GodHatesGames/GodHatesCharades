app.factory('Discount', function (DS, $q) {
  // vars
  var definition = {
    name: 'discount',
    defaultAdapter: 'discountAdapter',
    computed: {
    },
    methods: {
      // Instance methods
    }
  }

  // Adapter
  DS.adapters.discountAdapter = {
    findAll: _findAll
  };

  // init
  var Discount = DS.defineResource(definition);

  return Discount;

  // definition methods

  // adapter methods
  function _findAll(resource, id) {
    return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getAllDiscounts');
  }

  // class methods

  // instance methods




});