var socket = io.connect('http://localhost:3000');
var player_name = "";
socket.on('connect', function () {
	//player_name = prompt("Enter name:");
	//socket.emit('addUser', player_name);
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
	TILE_SIZE  = 32;
	canvas_width = $("#game_canvas").width();
	canvas_height = $("#game_canvas").height();
	
	$MAP_INFO = {
		max_col : canvas_width/TILE_SIZE,
		max_row : canvas_height/TILE_SIZE
	};
	$("#game_canvas").css({
		"width" : canvas_width+"px",
		"height" : canvas_height+"px"
	});
	initMap();
	
	player_postion = randomPosition();

	PLAYER = {
		name : player_name,
		row : player_postion.row,
		col: player_postion.col
	}
	
	initPlayer(PLAYER);
	
	//dummy obstacles
	$("#" + 13).attr("class", "rock");
	$("#" + 292).attr("class", "rock");
	$("#" + 370).attr("class", "rock");
	$("#" + 401).attr("class", "rock");
	
	$KEY = {
		"w" : 87,
		"a" : 65,
		"s" : 83,
		"d" : 68
	}
	
	$(document).keydown(function(event) {
		movePlayer(event, PLAYER);
	});
	
});


function movePlayer(event, PLAYER){
	var address = getAddress(PLAYER);
	switch(event.keyCode){
			case $KEY.w:
				$("#" + address).attr("class", "empty");
				PLAYER.row--;
				address = getAddress(PLAYER);
				if(getTile(address) == "rock"){
					PLAYER.row++;
					address = getAddress(PLAYER);
					$("#" + address).attr("class", "player");
				}else{
					$("#" + address).attr("class", "player");
				}
			break;
			case $KEY.a:
				$("#" + address).attr("class", "empty");
				PLAYER.col--;
				address = getAddress(PLAYER);
				if(getTile(address) == "rock"){
					PLAYER.col++;
					address = getAddress(PLAYER);
					$("#" + address).attr("class", "player");
				}else{
					$("#" + address).attr("class", "player");
				}
			break;
			case $KEY.s:
				$("#" + address).attr("class", "empty");
				PLAYER.row++;
				address = getAddress(PLAYER);
				if(getTile(address) == "rock"){
					PLAYER.row--;
					address = getAddress(PLAYER);
					$("#" + address).attr("class", "player");
				}else{
					$("#" + address).attr("class", "player");
				}
			break;
			case $KEY.d:
				$("#" + address).attr("class", "empty");
				PLAYER.col++;
				address = getAddress(PLAYER);
				if(getTile(address) == "rock"){
					PLAYER.col--;
					address = getAddress(PLAYER);
					$("#" + address).attr("class", "player");
				}else{
					$("#" + address).attr("class", "player");
				}
			break;
		}
}
function getTile(address){
	return $("#" + address).attr("class");
}
function initPlayer(PLAYER){
	var address = getAddress(PLAYER);
	$("#" + address).attr("class", "player");
}
function randomPosition(){
	var position = {row:0, col:0};
	position.row = parseInt(Math.random() * $MAP_INFO.max_row);
	position.col = parseInt(Math.random() * $MAP_INFO.max_col);
	return position;
}
function getAddress(PLAYER){
	var player_address = (PLAYER.row * $MAP_INFO.max_col) + PLAYER.col;
	return player_address;
}
function initMap(){
	var html = "";
	var address = 0;
	var tile = {
		row : 0,
		col : 0
	}
	$MAP_DATA = Array($MAP_INFO.max_row);
	for(row=0;row<$MAP_INFO.max_row;row++){
		$MAP_DATA[row] = Array($MAP_INFO.max_col);
		html += "<div class='row'>";
		for(col=0;col<$MAP_INFO.max_col;col++){
			$MAP_DATA[col] = "empty";
			tile.row = row;
			tile.col = col;
			address = getAddress(tile);
			html += "<div class='column'><div id=" + address + " class='" + 'empty' + "'></div></div>";
		}
		html += "</div>";
	}
	$("#game_canvas").html(html);
}