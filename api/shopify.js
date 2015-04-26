var request = require('request');
var util = require('util');
var shopifyUrl = util.format('https://%s:%s@godhatesgames.myshopify.com/admin/', process.env.SHOPIFY_API_KEY, process.env.SHOPIFY_PASSWORD);
console.log('shopifyUrl:', shopifyUrl);
module.exports.productById = _getProductById;
module.exports.collectionById = _getCollectionById;

function _getProductById(req, res) {
  console.log('get product:', req.params.id);
  var options = {
    url: shopifyUrl + 'products.json?ids=' + req.params.id,
    'Content-Type': 'application/json'
  }
  request.get(options, _onProductRetrieved);

  function _onProductRetrieved(error, response, body) {
    if(error) {
      res.send(500, error);
    } else {
      var parsed = JSON.parse(body);
      res.send(200, parsed.products);
    }
  }
}

function _getCollectionById(req, res) {
  var options = {
    url: shopifyUrl + 'collects.json?collection_id=' + req.params.id,
    'Content-Type': 'application/json'
  }
  console.log(options.url);
  request.get(options, _onCollectionRetrieved);

  function _onCollectionRetrieved(error, response, body) {
    if(error) {
      res.send(500, error);
    } else {
      console.log(body);
      var parsed = JSON.parse(body);
      res.send(200, parsed.collects);
    }
  }
}
