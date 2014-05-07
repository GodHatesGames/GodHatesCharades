'use strict';
var express = require('express');
var path = require('path');

var port = process.env.PORT || 3000;
var files = process.env.FILES || '../frontend';

var server = express(); // better instead
// server.use(express.logger());
server.use(express.bodyParser());

// Define our static file directory, it will be 'public'
var staticFilePath = path.join(__dirname, files);
console.log('staticFilePath:', staticFilePath);
server.use('/', express.static(staticFilePath));

server.get('/[^.]+$', function(req, res){
	res.set('Content-Type', 'text/html')
	.sendfile(staticFilePath + '/index.html');
});


server.listen(port);
console.log('GodHatesCharades is rusting on port', port);