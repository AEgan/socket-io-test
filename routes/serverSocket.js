exports.init = function(io) {
	var connectedNames = {};
	io.sockets.on('connection', function(socket) {
		// on connection, see if the basics work
		socket.emit('test', {message: "SocketIO working properly"});

		// when the client sends a 'message sent' message, we do this
		socket.on('messageSent', function(data){
			console.log('NAME WAS ' + data.name);
			console.log('MESSAGE WAS ' + data.message);
			var messageToEmit = filterInput(data.message);
			// reply by emiting only to the client that sent the message with this here response
			socket.emit('sendChat', {name: data.name, message: messageToEmit });
			socket.broadcast.emit('sendChat', {name: data.name, message: messageToEmit });
		});

		// when a name is entered, let people know who is connected, add username to list
		// also filter the name and send it back so it does not cause xss
		socket.on('nameEntered', function(data){
			var nameString = filterInput(data.name);
			socket.username = nameString;
			connectedNames[nameString] = nameString;
			socket.emit('filterName', {name: nameString});
			socket.emit('newName', {names: connectedNames});
			socket.broadcast.emit('newName', { names: connectedNames });
		});

		// on disconnect, delete username from connected names
		socket.on('disconnect', function(){
			delete connectedNames[socket.username];
			socket.broadcast.emit('newName', { names: connectedNames });
		});

	});

	// a filterInput function to make sure people don't get crafty with xss
	// even though this isn't fully secure obviously
	function filterInput(unfiltered){
		var filtered = unfiltered.replace("<", "&#60;");
		filtered = filtered.replace(">", "&#62;");
		if(filtered === unfiltered) {
			return filtered;
		}
		else {
			return filterInput(filtered);
		}
	}
}