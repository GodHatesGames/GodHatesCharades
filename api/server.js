'use strict';
require('newrelic');
var express = require('express');
var path = require('path');
var prerender = require('prerender-node');
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var mailchimp = require('./mailchimp');
var shopify = require('./shopify');
var s3data = require('./s3data');
var redisCache = require('./redis-cache');
var prismic = require('./prismic-helpers');
var aftership = require('./aftership');

var port = process.env.PORT || 3000;
var files = process.env.FILES || '../frontend';

// Define our static file directory, it will be 'public'
var staticFilePath = path.join(__dirname, files);
console.log('staticFilePath:', staticFilePath);

var server = express(); // better instead
// remove trailing slashes
server.use(function(req, res, next) {
  if(req.url.substr(-1) == '/' && req.url.length > 1)
    res.redirect(301, req.url.slice(0, -1));
  else
    next();
});
// use prerender.io
server.use(prerender.set('prerenderToken', process.env.PRERENDER_TOKEN));
server.engine('html', require('ejs').renderFile);
server.set('views', staticFilePath);
server.set('view engine', 'html');
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(compression());
server.use(cookieParser())

if(process.env.NODE_ENV === 'development') {
  // server.use(express.logger());
  server.use(require('errorhandler')());
  server.use(require('connect-livereload')());
}

server.use(express.static(staticFilePath));

// api routes
server.post('/api/subscribe', mailchimp.subscribe);
server.get('/api/files', s3data.getFiles);
server.get('/api/store/collection/:id', redisCache, shopify.collectionById);
server.get('/api/store/collection/:id/product', redisCache, shopify.productByCollectionId);
server.get('/api/stats/shipments/:supersecret', aftership.shipmentStats);
server.get('/api/prismic/', prismic.route(prismic.getDocument));

// pass the frontend routes
server.get('/home', showIndex);
server.get('/submit', showIndex);
server.get('/vote', showIndex);
server.get('/login', showIndex);
server.get('/user/*', showIndex);
server.get('/fixme', showIndex);
server.get('/card/*/*', showIndex);
server.get('/pair/*/*', showIndex);
server.get('/top/*', showIndex);
server.get('/admin/*', showIndex);
server.get('/blog', showIndex);
server.get('/blog/*/*', showIndex);
server.get('/mail/*', showIndex);
server.get('/rules', showIndex);
server.get('/share', showIndex);
server.get('/timeline', showIndex);
server.get('/watch', showIndex);
server.get('/store', showIndex);
server.get('/store/thanks', showIndex);

// prismic preview
server.get('/preview', showPreview());

// otherwise 404
server.get('/*', show404);

function showIndex(req, res) {
  res.render('index');
}

function show404(req, res) {
  res.status(404);
  showIndex(req, res);
}

// -- Preview documents from the Writing Room

function showPreview() {
  return prismic.route(function(req, res, ctx) {
    var token = req.query['token'];

    if (token) {
      console.log('token', token);
      ctx.api.previewSession(token, ctx.linkResolver, '/', function(err, url) {
        res.cookie(prismic.previewCookie, token, { maxAge: 30 * 60 * 1000, path: '/', httpOnly: false });
        res.redirect(301, url);
      });
    } else {
      res.send(400, "Missing token from querystring");
    }
  });
}


server.listen(port, function() {
  console.log('GodHatesCharades is rusting on port', port);
});