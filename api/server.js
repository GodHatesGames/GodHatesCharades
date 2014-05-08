'use strict';
var express = require('express');
var path = require('path');

var port = process.env.PORT || 3000;
var files = process.env.FILES || '../frontend';

// Define our static file directory, it will be 'public'
var staticFilePath = path.join(__dirname, files);
console.log('staticFilePath:', staticFilePath);

var server = express(); // better instead
server.engine('html', require('ejs').renderFile);
server.set('views', staticFilePath);
server.set('view engine', 'html');
server.use(express.logger());
server.use(express.bodyParser());

server.use(express.static(staticFilePath));
server.use('/print/*', express.static(staticFilePath));
server.get('/*', function(req, res) {
	res.render('index');
});


server.listen(port);
console.log('GodHatesCharades is rusting on port', port);