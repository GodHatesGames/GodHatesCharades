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
    findAll: _findAll,
    update: _update,
    create: _create
  };

  // init
  var Discount = DS.defineResource(definition);

  return Discount;

  // definition methods

  // adapter methods
  function _findAll(resource, id) {
    return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getAllDiscounts');
  }

  function _update(resource, id, attrs) {
    return Parse.Cloud.run(
      CONFIG.PARSE_VERSION + 'updateDiscount',
      attrs,
      {
        success: onSaved
      }
    );

    function onSaved (updatedDiscount) {
      var discount = Discount.get(id);
      _.extend(discount, updatedDiscount.attributes);
      return discount;
    }
  }

  function _create(resource, discount) {
    return Parse.Cloud.run(
      CONFIG.PARSE_VERSION + 'createDiscount',
      discount
    );
  }

  // class methods

  // instance methods




});