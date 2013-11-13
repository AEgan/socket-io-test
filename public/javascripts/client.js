// the submit callback 
$(function() {
	$("#submitChat").click(chatSubmit);
	$("#nameForm").submit(setName);
});

var socket = io.connect('/');
var nameStr;
var colStr;
// check for the initial test 
socket.on('test', function(data) {
	$("#testArea").text(data.message);
});

// server responds by sending the chat message to everyone
socket.on('sendChat', function(data){
	var ul = $("#chatUL");
	var dateArray = Date().split(' ');
	var dateString = dateArray[4].substring(0, dateArray[4].length - 3);
	var nameSpanPart = "<span class='nameSpan' style='color: " + data.color + "'>" + data.name + "</span>";
	var toAppend = $("<li>" + nameSpanPart + ":  " + data.message + " <span class='dateSpan'>-- at " + dateString + "</span></li>");
	ul.append(toAppend);
	if(ul.find("li").length >= 20) {
		ul.find("li").first().remove();
	}
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
	// make sure the text are isn't empty
	if($.trim($("#chatTextArea").val())){
		var str = $("#chatTextArea").val();
		socket.emit('messageSent', { name: nameStr, message: str, color: colStr });
		// clear the text area
		$("#chatTextArea").val("");
	}
}

// set the name, send it to server, show user they are connected as their name
function setName() {
	if(!$.trim($("#name").val())) {
		alert("you have to enter a name buddy!");
	}
	else {
		$("#nameForm").fadeOut();
		colStr = $("#dispColor").val()
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
}