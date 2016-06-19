var _ = require('lodash');
exports.props = [
  'code',
  'url',
  'paramKey',
  'paramValue',
  'feature'
];
exports.getFeaturedDiscount = _getFeaturedDiscount;
exports.getDiscountByParams = _getDiscountByParams;
var Discount = Parse.Object.extend('Discount');

function _getFeaturedDiscount(request, response) {
  // to allow fetching owners
  //Parse.Cloud.useMasterKey();

  var query = new Parse.Query(Discount);
  query.equalTo('feature', true);
  return query.first({
    success: response.success,
    error: response.error
  });

}

function _getDiscountByParams(request, response) {
  // to allow fetching owners
  //Parse.Cloud.useMasterKey();

  console.log(request.params.search);

  var keys = _.keys(request.params.search);
  var values = _.values(request.params.search);

  var query = new Parse.Query(Discount);
  query.containedIn('paramKey', keys);
  query.containedIn('paramValue', values);
  return query.first({
    success: response.success,
    error: response.error
  });

}