var socket = io.connect('/');
socket.on('test', function(data) {
	$("#testArea").text(data.message);
});