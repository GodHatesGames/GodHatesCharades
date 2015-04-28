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

module.exports = _redisCache;

function _redisCache(req, res, next) {
  // console.log('getting request with redisCache:', req.originalUrl);
  var key = req.originalUrl;
  cache.get(key, _onCacheRetrieved);

  function _onCacheRetrieved(error, value) {
    if(value) {
      // console.log('sending cached value');
      res.status(200).send(value);
    } else {
      // console.log('fetching latest values');
      var Send = res.send.bind(res);
      res.send = function(body) {
        Send(body);
        cache.set(key, body, cacheTTL);
      }
      next();
    }
  }
}