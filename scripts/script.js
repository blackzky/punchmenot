var socket = io.connect('http://localhost:3000');
socket.on('connect', function () {
    //socket.on('message', function (msg) {  });
	socket.emit('addUser', prompt("Enter name:"));

	socket.on('setPlayerList', function(data) {
	 $("div#player_list ul").empty();
	  for(var i = 0; i < data.length; i++){
		$("div#player_list ul").append("<li>" + data[i] + "</li>");
	  } 
	});

	socket.on('updatePlayerList', function(data){
	  $("div#player_list ul").append("<li>" + data + "</li>");
	});


});

$(document).ready(function() {
	
});