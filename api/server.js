'use strict';
require('newrelic');
var express = require('express');
var path = require('path');
var prerender = require('prerender-node');
var mailchimp = require('./mailchimp');
var compression = require('compression');

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
server.use(express.bodyParser());
server.use(compression());

server.configure('development', function(){
	// server.use(express.logger());
	server.use(express.errorHandler());
});

server.use(express.static(staticFilePath));

server.post('/api/subscribe', mailchimp.subscribe);

// pass the frontend routes
server.get('/home', showIndex);
server.get('/submit', showIndex);
server.get('/vote', showIndex);
server.get('/login', showIndex);
server.get('/user/*', showIndex);
server.get('/card/*/*', showIndex);
server.get('/pair/*/*', showIndex);
server.get('/top/*', showIndex);
server.get('/admin/*', showIndex);
server.get('/blog', showIndex);
server.get('/blog/*/*', showIndex);
server.get('/mail/*', showIndex);
server.get('/rules', showIndex);
server.get('/share', showIndex);

// otherwise 404
server.get('/*', show404);

function showIndex(req, res) {
	res.render('index');
}

function show404(req, res) {
	res.status(404);
	showIndex(req, res);
}


server.listen(port, function() {
	console.log('GodHatesCharades is rusting on port', port);
});