exports.init = function(io) {
	var connectedNames = {};
	io.sockets.on('connection', function(socket) {
		// on connection, see if the basics work
		socket.emit('test', {message: "SocketIO working properly"});

		// when the client sends a 'message sent' message, we do this
		socket.on('messageSent', function(data){
			console.log('NAME WAS ' + data.name);
			console.log('MESSAGE WAS ' + data.message);
			// reply by emiting only to the client that sent the message with this here response
			socket.emit('sendChat', {name: data.name, message: data.message});
			socket.broadcast.emit('sendChat', {name: data.name, message: data.message});
		});

		// when a name is entered, let people know who is connected, add username to list
		socket.on('nameEntered', function(data){
			var nameString = data.name;
			socket.username = data.name;
			connectedNames[nameString] = nameString;
			socket.emit('newName', {names: connectedNames});
			socket.broadcast.emit('newName', { names: connectedNames });
		});

		// on disconnect, delete username from connected names
		socket.on('disconnect', function(){
			delete connectedNames[socket.username];
			socket.broadcast.emit('newName', { names: connectedNames });
		});

	});
}