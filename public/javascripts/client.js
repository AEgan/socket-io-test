// the submit callback 
$(function() {
	$("#submitChat").click(chatSubmit);
	$("#nameForm").submit(setName);
});

var socket = io.connect('/');
// check for the initial test 
socket.on('test', function(data) {
	$("#testArea").text(data.message);
});

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

// submits a chat message
function chatSubmit() {
	var str = $("#chatTextArea").val();
	socket.emit('messageSent', { name: $("#name").val(), message: str });
	$("#chatTextArea").val("");
}

// set the name, send it to server, show user they are connected as their name
function setName() {
	$("#nameForm").fadeOut();
	$("#chat").fadeIn();
	$("#testArea").text("Connected as " + $("#name").val());
	socket.emit('nameEntered', { name: $("#name").val() });
	$("#connectedSpan").text("Connected Users:");
	// now that this works we can set the text area to submit on enter. Taken from 
	// http://stackoverflow.com/questions/789701/submitting-data-from-textarea-by-hitting-enter
	document.getElementById("chatTextArea").onkeyup = function(e){
	  e = e || event;
	  if (e.keyCode === 13) {
	    chatSubmit();
	  }
	  return true;
	 }
	return false;
}