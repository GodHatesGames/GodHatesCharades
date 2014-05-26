'use strict';
require('newrelic');
var express = require('express');
var path = require('path');
var prerender = require('prerender-node');

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
server.use(express.logger());
server.use(express.bodyParser());

server.use(express.static(staticFilePath));
server.get('/*', function(req, res) {
	res.render('index');
});


server.listen(port, function() {
	console.log('GodHatesCharades is rusting on port', port);
});