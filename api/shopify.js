var _ = require('lodash');
var request = require('request');
var redis = require('redis');
var redisOptions = { 
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASS,
  database: process.env.REDIS_DB
};
var cacheTTL = process.env.REDIS_CACHE_TTL;
var CachemanRedis = require('cacheman-redis');
var cache = new CachemanRedis(redisOptions);

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
  cache.get(options.url, _onCacheRetrieved);

  function _onCacheRetrieved(error, value) {
    if(value) {
      res.send(200, value);
    } else {
      request.get(options, _onProductRetrieved);
    }
  }

  function _onProductRetrieved(error, response, body) {
    if(error) {
      res.send(500, error);
    } else {
      var parsed = JSON.parse(body);
      _.each(parsed.products, function(product) {
        product.collection_id = req.params.id;
      });
      cache.set(options.url, parsed.products, cacheTTL);
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
      res.send(200, {
        id: req.params.id,
        items: parsed.collects
      });
    }
  }
}
