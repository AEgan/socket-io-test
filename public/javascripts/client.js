// the submit callback 
$(function() {
	$("#f1").submit(messageSubmit);
});

var socket = io.connect('/');
// check for the initial test 
socket.on('test', function(data) {
	$("#testArea").text(data.message);
});

// the submission callback is here, sends the messagesent message to the server
function messageSubmit() {
	socket.emit('messageSent', { name: $("#name").val(), message: $("#message").val() });
	return false;
}

// the server responds with a messageresponse message
socket.on('messageResponse', function(data) {
	console.log('here');
	// alert with the message for now.
	alert('server hearing this: ' + data.message);
});