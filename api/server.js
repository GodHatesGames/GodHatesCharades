var express = require('express');
var path = require('path');

var port = process.env.PORT || 3000;
var files = process.env.FILES || '../frontend';

var server = express(); // better instead

// Define our static file directory, it will be 'public'
var staticFilePath = path.join(__dirname, files);
server.use('/', express.static(staticFilePath));
// server.use(express.logger());
server.use(express.bodyParser());

server.listen(port);
console.log('GodHatesCharades is rusting on port', port);