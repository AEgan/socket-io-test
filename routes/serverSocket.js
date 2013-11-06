exports.init = function(io) {
	io.sockets.on('connection', function(socket) {
		// on connection, see if the basics work
		socket.emit('test', {message: "Test worked"});

		// when the client sends a 'message sent' message, we do this
		socket.on('messageSent', function(data){
			console.log('VALUE WAS ' + data.value);
			// reply by emiting only to the client that sent the message with this here response
			socket.emit('messageResponse', {message: "got this: " + data.value + " and I love tweets"});
		});
	});
}