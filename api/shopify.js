var _ = require('lodash');
var request = require('request');

var util = require('util');
var shopifyUrl = util.format('https://%s:%s@godhatesgames.myshopify.com/admin/', process.env.SHOPIFY_API_KEY, process.env.SHOPIFY_PASSWORD);
console.log('shopifyUrl:', shopifyUrl);
module.exports.productByCollectionId = _getProductByCollectionId;
module.exports.collectionById = _getCollectionById;

function _getProductByCollectionId(req, res) {
  console.log('get product:', req.params.id);
  var options = {
    url: shopifyUrl + 'products.json?collection_id=' + req.params.id,
    'Content-Type': 'application/json'
  }
  request.get(options, _onProductRetrieved);

  function _onProductRetrieved(error, response, body) {
    if(error) {
      res.status(500).send(error);
    } else {
      var parsed = JSON.parse(body);
      _.each(parsed.products, function(product) {
        product.collection_id = req.params.id;
      });
      res.status(200).send(parsed.products);
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
      res.status(500).send(error);
    } else {
      console.log(body);
      var parsed = JSON.parse(body);
      res.status(200).send({
        id: req.params.id,
        items: parsed.collects
      });
    }
  }
}
