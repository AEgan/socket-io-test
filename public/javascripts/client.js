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
	$("#message").val("");
	return false;
}

// server responds by sending the chat message to everyone
socket.on('sendChat', function(data){
	var ul = $("#chatUL");
	ul.append("<li>" + data.name + ":  " + data.message + " </li");
});