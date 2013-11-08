// the submit callback 
$(function() {
	$("#f1").submit(messageSubmit);
	$("#nameForm").submit(setName);
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

// when a new name is connected, display all names
socket.on('newName', function(data){
	$("#nameList").html("");
	for(var property in data.names) {
		$("#nameList").append("<li>" + data.names[property] + "</li>");
	}
});

// set the name, send it to server, show user they are connected as their name
function setName() {
	$("#nameForm").fadeOut();
	$("#chat").fadeIn();
	$("#testArea").text("Connected as " + $("#name").val());
	socket.emit('nameEntered', { name: $("#name").val() });
	$("#connectedSpan").text("Connected Users:")
	return false;
}