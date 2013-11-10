// the submit callback 
$(function() {
	$("#submitChat").click(chatSubmit);
	$("#nameForm").submit(setName);
});

var socket = io.connect('/');
var nameStr;
// check for the initial test 
socket.on('test', function(data) {
	$("#testArea").text(data.message);
});

// server responds by sending the chat message to everyone
socket.on('sendChat', function(data){
	var ul = $("#chatUL");
	var dateArray = data.date.split(' ');
	var dateString = dateArray[4].substring(0, dateArray[4].length - 3);
	ul.append("<li>" + data.name + ":  " + data.message + " -- at " + dateString + " </li>");
});

// when a new name is connected, display all names
socket.on('newName', function(data){
	$("#nameList").html("");
	for(var property in data.names) {
		$("#nameList").append("<li>" + data.names[property] + "</li>");
	}
});

// sets the name in the form to a filtered name so there is less xss 
socket.on('filterName', function(data){
	$("#name").val("" + data.name);
	nameStr = data.name;
});

// submits a chat message
function chatSubmit() {
	var str = $("#chatTextArea").val();
	socket.emit('messageSent', { name: nameStr, message: str });
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