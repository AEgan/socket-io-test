exports.init = function(io) {
	io.sockets.on('connection', function(socket) {
		// on connection, see if the basics work
		socket.emit('test', {message: "Test worked"});

		// when the client sends a 'message sent' message, we do this
		socket.on('messageSent', function(data){
			console.log('NAME WAS ' + data.name);
			console.log('MESSAGE WAS ' + data.message);
			// reply by emiting only to the client that sent the message with this here response
			socket.emit('sendChat', {name: data.name, message: data.message});
			socket.broadcast.emit('sendChat', {name: data.name, message: data.message});
		});
	});
}