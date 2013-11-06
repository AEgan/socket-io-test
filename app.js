var express = require('express')
  , http = require('http')
  , path = require('path')
  , sio = require('socket.io')
  , serverSockets = require('./routes/serverSocket.js');
  
var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger('tiny'));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler());
});

var server = http.createServer(app);
var io = sio.listen(server);
server.listen(12345, function(){
  console.log("Express server listening on port 12345");
	});

serverSockets.init(io);