'use strict';
var express = require('express');
var path = require('path');
var mailingList = require('./mailing-list');
var shopify = require('./shopify');
var s3data = require('./s3data');
var redisCache = require('./redis-cache');
var compression = require('compression');
var bodyParser = require('body-parser');
var ParseServer = require('parse-server').ParseServer;
// var aftership = require('./aftership');

var parseApi = new ParseServer({
  databaseURI: process.env.PARSE_DB, // Connection string for your MongoDB database
  cloud: './Parse/cloud/main.js', // Absolute path to your Cloud Code
  appId: process.env.PARSE_APP_ID,
  masterKey: process.env.PARSE_MASTER_KEY, // Keep this key secret!
  fileKey: 'optionalFileKey',
  serverURL: process.env.PARSE_SERVER_URL // Don't forget to change to https if needed
});

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
server.engine('html', require('ejs').renderFile);
server.set('views', staticFilePath);
server.set('view engine', 'html');
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(compression());

// Serve the Parse API on the /parse URL prefix
server.use('/parse', parseApi);

if(process.env.NODE_ENV === 'development') {
	// server.use(express.logger());
	server.use(require('errorhandler')());
	server.use(require('connect-livereload')());
}

server.use(express.static(staticFilePath));

// api routes
server.post('/api/subscribe', mailingList.subscribe);
server.get('/api/files', s3data.getFiles);
server.get('/api/store/collection/:id', redisCache, shopify.collectionById);
server.get('/api/store/collection/:id/product', redisCache, shopify.productByCollectionId);
// server.get('/api/stats/shipments/:supersecret', aftership.shipmentStats);

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
server.get('/admin', showAdmin);
server.get('/admin/*', showAdmin);
server.get('/blog', showIndex);
server.get('/blog/*/*', showIndex);
server.get('/mail/*', showIndex);
server.get('/rules', showIndex);
server.get('/press', showIndex);
server.get('/share', showIndex);
server.get('/timeline', showIndex);
server.get('/watch', showIndex);
server.get('/wholesale', showIndex);
server.get('/store', showIndex);
server.get('/store/thanks', showIndex);
server.get('/products/*', showIndex);

// prismic preview
server.get('/preview', showPreview);

// otherwise 404
server.get('/*', show404);

function showIndex(req, res) {
	res.render('index');
}

function showAdmin(req, res) {
	res.render('admin');
}

function show404(req, res) {
	res.status(404);
	showIndex(req, res);
}

function showPreview(req, res, ctx) {
	var previewToken = req.query['token'];
	ctx.api.previewSession(previewToken, ctx.linkResolver, '/', function(err, redirectUrl) {
		res.cookie(Prismic.previewCookie, previewToken, { maxAge: 60 * 30, path: '/', httpOnly: false });
		res.redirect(redirectUrl);
	});
}


server.listen(port, function() {
	console.log('GodHatesCharades is rusting on port', port);
});